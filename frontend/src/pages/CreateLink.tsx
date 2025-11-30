import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Plus, X, Link2 } from "lucide-react";
import { toast } from "sonner";
import { CustomField, FieldType } from "@/lib/types";



export default function CreateLink() {
  const navigate = useNavigate();
  const [linkType, setLinkType] = useState<"one-time" | "time-based" | "public">("one-time");
  const [amount, setAmount] = useState("");
  const [description, setDescription] = useState("");
  const [expiryDate, setExpiryDate] = useState("");
  const [customFields, setCustomFields] = useState<CustomField[]>([]);
  const [optionInputs, setOptionInputs] = useState<Record<string, string>>({});
  const [isCreating, setIsCreating] = useState(false);
  const [showPreview, setShowPreview] = useState(false);

  const addCustomField = () => {
    setCustomFields([
      ...customFields,
      {
        id: Date.now().toString(),
        label: "",
        type: "text",
        required: false,
      },
    ]);
  };

  const removeCustomField = (id: string) => {
    setCustomFields(customFields.filter((field) => field.id !== id));
  };

  const updateField = (id: string, updates: Partial<CustomField>) => {
    setCustomFields(
      customFields.map((field) => (field.id === id ? { ...field, ...updates } : field))
    );
  };

  const handlePreview = (e: React.FormEvent) => {
    e.preventDefault();
    setShowPreview(true);
  };

  const handleCreate = async () => {
    setIsCreating(true);

    try {
      await api.post('/links', {
        amount,
        description,
        type: linkType,
        expiryDate: linkType === 'time-based' ? expiryDate : null,
        customFields
      });

      toast.success("Payment link created!", {
        description: "Your link has been generated and is ready to share",
      });
      navigate("/links");
    } catch (error) {
      console.error("Create link error:", error);
      toast.error("Failed to create link");
    } finally {
      setIsCreating(false);
      setShowPreview(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto">
      <div className="mb-6">
        <h1 className="text-white text-3xl font-display font-bold mb-1">Create Payment Link</h1>
        <p className="text-muted-foreground">Generate a shareable link to receive payments</p>
      </div>

      <form onSubmit={handlePreview} className="space-y-6">
        <Card className="border-border">
          <CardHeader>
            <CardTitle className="font-display">Link Configuration</CardTitle>
            <CardDescription>Set up your payment link details</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="amount">Amount (USD)</Label>
              <Input
                id="amount"
                type="number"
                step="0.01"
                min="0.01"
                placeholder="0.00"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description (Optional)</Label>
              <Textarea
                id="description"
                placeholder="What is this payment for?"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={3}
              />
            </div>

            <div className="space-y-3">
              <Label>Link Type</Label>
              <RadioGroup value={linkType} onValueChange={(v: any) => setLinkType(v)}>
                <div className="flex items-center space-x-2 p-3 rounded-lg border border-border hover:bg-accent/50 transition-smooth">
                  <RadioGroupItem value="one-time" id="one-time" />
                  <Label htmlFor="one-time" className="flex-1 cursor-pointer">
                    <div className="font-medium">One-time Link</div>
                    <div className="text-sm text-muted-foreground">
                      Expires after first payment
                    </div>
                  </Label>
                </div>
                <div className="flex items-center space-x-2 p-3 rounded-lg border border-border hover:bg-accent/50 transition-smooth">
                  <RadioGroupItem value="time-based" id="time-based" />
                  <Label htmlFor="time-based" className="flex-1 cursor-pointer">
                    <div className="font-medium">Time-based Link</div>
                    <div className="text-sm text-muted-foreground">
                      Expires at specific date/time
                    </div>
                  </Label>
                </div>
                <div className="flex items-center space-x-2 p-3 rounded-lg border border-border hover:bg-accent/50 transition-smooth">
                  <RadioGroupItem value="public" id="public" />
                  <Label htmlFor="public" className="flex-1 cursor-pointer">
                    <div className="font-medium">Public Link</div>
                    <div className="text-sm text-muted-foreground">Never expires</div>
                  </Label>
                </div>
              </RadioGroup>
            </div>

            {linkType === "time-based" && (
              <div className="space-y-2">
                <Label htmlFor="expiry">Expiry Date & Time</Label>
                <Input
                  id="expiry"
                  type="datetime-local"
                  value={expiryDate}
                  onChange={(e) => setExpiryDate(e.target.value)}
                  required
                />
              </div>
            )}
          </CardContent>
        </Card>

        <Card className="border-border">
          <CardHeader>
            <CardTitle className="font-display">Custom Fields</CardTitle>
            <CardDescription>Add optional fields for payers to fill</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {customFields.map((field) => (
              <div key={field.id} className="p-4 rounded-lg border border-border space-y-3">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex-1 space-y-3">
                    <Input
                      placeholder="Field label (e.g., Name, Email)"
                      value={field.label}
                      onChange={(e) => updateField(field.id, { label: e.target.value })}
                    />
                    <Select
                      value={field.type}
                      onValueChange={(v: FieldType) => updateField(field.id, { type: v })}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="text">Text Input</SelectItem>
                        <SelectItem value="select">Dropdown</SelectItem>
                        <SelectItem value="textarea">Text Area</SelectItem>
                      </SelectContent>
                    </Select>

                    {field.type === 'select' && (
                      <div className="space-y-2">
                        <Label className="text-xs text-muted-foreground">Options (comma separated)</Label>
                        <Input
                          placeholder="Option 1, Option 2, Option 3"
                          value={optionInputs[field.id] ?? field.options?.join(', ') ?? ''}
                          onChange={(e) => {
                            const val = e.target.value;
                            setOptionInputs(prev => ({ ...prev, [field.id]: val }));
                            updateField(field.id, {
                              options: val.split(',').map(s => s.trim()).filter(Boolean)
                            });
                          }}
                        />
                      </div>
                    )}
                  </div>
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    onClick={() => removeCustomField(field.id)}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            ))}

            <Button
              type="button"
              variant="outline"
              onClick={addCustomField}
              className="w-full border-dashed"
            >
              <Plus className="mr-2 h-4 w-4" />
              Add Custom Field
            </Button>
          </CardContent>
        </Card>

        <Button
          type="submit"
          className="w-full h-12 gradient-primary hover:opacity-90 transition-smooth"
        >
          Preview Payment Link
        </Button>
      </form>

      <Dialog open={showPreview} onOpenChange={setShowPreview}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Preview Payment Link</DialogTitle>
            <DialogDescription>
              Review the details before creating your payment link.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <p className="text-muted-foreground">Amount</p>
                <p className="font-medium">${amount}</p>
              </div>
              <div>
                <p className="text-muted-foreground">Type</p>
                <p className="font-medium capitalize">{linkType.replace('-', ' ')}</p>
              </div>
              {description && (
                <div className="col-span-2">
                  <p className="text-muted-foreground">Description</p>
                  <p className="font-medium">{description}</p>
                </div>
              )}
              {linkType === 'time-based' && expiryDate && (
                <div className="col-span-2">
                  <p className="text-muted-foreground">Expires</p>
                  <p className="font-medium">{new Date(expiryDate).toLocaleString()}</p>
                </div>
              )}
            </div>

            {customFields.length > 0 && (
              <div className="border-t pt-4">
                <p className="text-sm font-medium mb-2">Custom Fields</p>
                <ul className="text-sm space-y-1">
                  {customFields.map(field => (
                    <li key={field.id} className="text-muted-foreground">
                      • {field.label || '(Untitled)'} ({field.type})
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setShowPreview(false)}>
              Cancel
            </Button>
            <Button
              onClick={handleCreate}
              className="gradient-primary hover:opacity-90"
              disabled={isCreating}
            >
              {isCreating ? (
                "Creating..."
              ) : (
                <>
                  <Link2 className="mr-2 h-4 w-4" />
                  Create Link
                </>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
