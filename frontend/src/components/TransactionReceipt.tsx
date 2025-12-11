import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { CheckCircle2, ExternalLink, Copy } from "lucide-react";
import { toast } from "sonner";
import { EXPLORER_URL } from "@/lib/constants";

interface TransactionReceiptProps {
    open: boolean;
    onClose: () => void;
    transaction: {
        hash: string;
        amount: string;
        token: string;
        to: string;
        createdAt: string;
    } | null;
}

export function TransactionReceipt({ open, onClose, transaction }: TransactionReceiptProps) {
    if (!transaction) return null;

    const copyToClipboard = (text: string) => {
        navigator.clipboard.writeText(text);
        toast.success("Copied to clipboard");
    };

    return (
        <Dialog open={open} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-md">
                <DialogHeader>
                    <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-green-100 dark:bg-green-900/20">
                        <CheckCircle2 className="h-6 w-6 text-green-600 dark:text-green-500" />
                    </div>
                    <DialogTitle className="text-center text-xl">Transaction Successful</DialogTitle>
                </DialogHeader>

                <div className="space-y-4 py-4">
                    <div className="flex flex-col items-center justify-center space-y-1 border-b pb-4">
                        <span className="text-sm text-muted-foreground">Amount Sent</span>
                        <span className="text-3xl font-bold">
                            {transaction.amount} {transaction.token}
                        </span>
                    </div>

                    <div className="space-y-3">
                        <div className="flex justify-between text-sm">
                            <span className="text-muted-foreground">To</span>
                            <div className="flex items-center gap-2">
                                <span className="font-medium truncate max-w-[200px]">{transaction.to}</span>
                                <button onClick={() => copyToClipboard(transaction.to)} className="text-muted-foreground hover:text-foreground">
                                    <Copy className="h-3 w-3" />
                                </button>
                            </div>
                        </div>

                        <div className="flex justify-between text-sm">
                            <span className="text-muted-foreground">Date</span>
                            <span className="font-medium">{new Date(transaction.createdAt).toLocaleString()}</span>
                        </div>

                        <div className="flex justify-between text-sm">
                            <span className="text-muted-foreground">Transaction Hash</span>
                            <div className="flex items-center gap-2">
                                <span className="font-medium truncate max-w-[150px]">{transaction.hash}</span>
                                <a
                                    href={`${EXPLORER_URL}/tx/${transaction.hash}`}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-primary hover:underline flex items-center gap-1"
                                >
                                    <ExternalLink className="h-3 w-3" />
                                </a>
                            </div>
                        </div>
                    </div>
                </div>

                <DialogFooter>
                    <Button onClick={onClose} className="w-full">
                        Done
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
