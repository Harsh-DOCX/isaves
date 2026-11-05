import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";

const DialogContext = createContext(null);

export const DialogProvider = ({ children }) => {
    const [dialogConfig, setDialogConfig] = useState(null);

    const closeDialog = useCallback((result) => {
        setDialogConfig((currentConfig) => {
            if (currentConfig?.resolve) {
                currentConfig.resolve(result);
            }
            return null;
        });
    }, []);

    const showAlert = useCallback(({ title = "Alert", message, buttonText = "OK" }) => (
        new Promise((resolve) => {
            setDialogConfig({
                type: "alert",
                title,
                message,
                confirmText: buttonText,
                resolve,
            });
        })
    ), []);

    const showConfirm = useCallback(({
        title = "Confirm",
        message,
        confirmText = "Confirm",
        cancelText = "Cancel",
    }) => (
        new Promise((resolve) => {
            setDialogConfig({
                type: "confirm",
                title,
                message,
                confirmText,
                cancelText,
                resolve,
            });
        })
    ), []);

    useEffect(() => {
        if (!dialogConfig) {
            return undefined;
        }

        const handleEscape = (event) => {
            if (event.key === "Escape") {
                closeDialog(false);
            }
        };

        document.addEventListener("keydown", handleEscape);

        return () => {
            document.removeEventListener("keydown", handleEscape);
        };
    }, [closeDialog, dialogConfig]);

    const contextValue = useMemo(
        () => ({ showAlert, showConfirm }),
        [showAlert, showConfirm],
    );

    return (
        <DialogContext.Provider value={contextValue}>
            {children}

            {dialogConfig && (
                <div
                    className="dialog-overlay"
                    role="presentation"
                    onClick={() => closeDialog(false)}
                >
                    <section
                        className="dialog-box"
                        role="dialog"
                        aria-modal="true"
                        aria-labelledby="dialog-title"
                        aria-describedby="dialog-message"
                        onClick={(event) => event.stopPropagation()}
                    >
                        <h2 id="dialog-title">{dialogConfig.title}</h2>
                        <p id="dialog-message">{dialogConfig.message}</p>

                        <div className="dialog-actions">
                            {dialogConfig.type === "confirm" && (
                                <button
                                    type="button"
                                    className="dialog-btn dialog-btn-cancel"
                                    onClick={() => closeDialog(false)}
                                >
                                    {dialogConfig.cancelText}
                                </button>
                            )}
                            <button
                                type="button"
                                className="dialog-btn dialog-btn-confirm"
                                onClick={() => closeDialog(true)}
                                autoFocus
                            >
                                {dialogConfig.confirmText}
                            </button>
                        </div>
                    </section>
                </div>
            )}
        </DialogContext.Provider>
    );
};

export const useDialog = () => {
    const context = useContext(DialogContext);

    if (!context) {
        throw new Error("useDialog must be used inside DialogProvider");
    }

    return context;
};
