import { useState, useMemo, useRef } from "react";
import { useVirtualizer } from "@tanstack/react-virtual";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Search } from "lucide-react";
import { Token } from "@/lib/blockchain/exchange";

interface TokenSelectorProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    tokens: Token[];
    onSelect: (token: Token) => void;
}

export function TokenSelector({ open, onOpenChange, tokens, onSelect }: TokenSelectorProps) {
    const [search, setSearch] = useState("");
    const parentRef = useRef<HTMLDivElement>(null);

    const filteredTokens = useMemo(() => {
        return tokens.filter((token) =>
            token.symbol.toLowerCase().includes(search.toLowerCase()) ||
            token.name.toLowerCase().includes(search.toLowerCase()) ||
            token.address.toLowerCase() === search.toLowerCase()
        );
    }, [tokens, search]);

    const rowVirtualizer = useVirtualizer({
        count: filteredTokens.length,
        getScrollElement: () => parentRef.current,
        estimateSize: () => 72, // box height + padding
        overscan: 5,
    });

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="max-w-md h-[80vh] flex flex-col p-0 gap-0 bg-background border-border">
                <DialogHeader className="p-4 border-b border-border">
                    <DialogTitle>Select Token</DialogTitle>
                    <div className="relative mt-2">
                        <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                        <Input
                            placeholder="Search by name or paste address"
                            className="pl-9"
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                        />
                    </div>
                </DialogHeader>

                <div
                    ref={parentRef}
                    className="flex-1 overflow-y-auto p-2"
                    style={{ contain: 'strict' }}
                >
                    <div
                        style={{
                            height: `${rowVirtualizer.getTotalSize()}px`,
                            width: '100%',
                            position: 'relative',
                        }}
                    >
                        {rowVirtualizer.getVirtualItems().map((virtualRow) => {
                            const token = filteredTokens[virtualRow.index];
                            return (
                                <div
                                    key={token.address}
                                    onClick={() => {
                                        onSelect(token);
                                        onOpenChange(false);
                                    }}
                                    className="absolute top-0 left-0 w-full p-2 cursor-pointer hover:bg-accent/50 rounded-lg transition-colors flex items-center gap-3"
                                    style={{
                                        height: `${virtualRow.size}px`,
                                        transform: `translateY(${virtualRow.start}px)`,
                                    }}
                                >
                                    <div className="w-10 h-10 rounded-full bg-muted flex items-center justify-center overflow-hidden shrink-0">
                                        {token.logoURI ? (
                                            <img
                                                src={token.logoURI}
                                                alt={token.symbol}
                                                className="w-full h-full object-cover"
                                                onError={(e) => {
                                                    (e.target as HTMLImageElement).src = `https://avatar.vercel.sh/${token.symbol}`;
                                                }}
                                            />
                                        ) : (
                                            <span className="text-xs font-bold">{token.symbol[0]}</span>
                                        )}
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-center justify-between">
                                            <span className="font-medium truncate">{token.name}</span>
                                            {/* Balance could go here if fetched */}
                                        </div>
                                        <div className="text-sm text-muted-foreground">{token.symbol}</div>
                                    </div>
                                </div>
                            );
                        })}

                        {filteredTokens.length === 0 && (
                            <div className="text-center py-8 text-muted-foreground">
                                No tokens found
                            </div>
                        )}
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
}
