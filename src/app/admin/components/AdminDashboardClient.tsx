"use client";
import React, { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { filterAccountEmails } from "@/server/accountAction";
import { Loader2, Copy, Check } from "lucide-react";
import { toast } from "sonner";
import { Textarea } from "@/components/ui/textarea";

export default function AdminDashboard() {
  const [filters, setFilters] = useState({
    verified: true, // Por defecto filtramos cuentas verificadas
    emptyChildren: false,
    pendingOrders: false,
  });

  const [loading, setLoading] = useState(false);
  const [emails, setEmails] = useState<string[]>([]);
  const [separator, setSeparator] = useState<"semicolon" | "comma">(
    "semicolon"
  );
  const [copied, setCopied] = useState(false);

  const handleFilterChange = (key: keyof typeof filters, value?: boolean) => {
    setFilters((prev) => ({
      ...prev,
      [key]: value !== undefined ? value : !prev[key],
    }));
  };

  const handleSubmit = async () => {
    setLoading(true);
    try {
      const result = await filterAccountEmails(filters);
      if (result.success) {
        setEmails(result.emails || []);
        toast.success(`Se encontraron ${result.emails?.length || 0} emails`);
      } else {
        toast.error(result.message || "Error al filtrar emails");
      }
    } catch (error) {
      console.error("Error filtrando emails:", error);
      toast.error("Error inesperado");
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = () => {
    if (emails.length === 0) return;

    const separatorChar = separator === "semicolon" ? "; " : ", ";
    navigator.clipboard.writeText(emails.join(separatorChar));

    setCopied(true);
    toast.success("Emails copiados al portapapeles");
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="p-6 w-full max-w-4xl">
      <h1 className="text-2xl font-bold mb-6">Filtrar emails para campañas</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Filtrar emails de cuentas</CardTitle>
            <CardDescription>
              Selecciona las condiciones para filtrar los emails
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <Label>Estado de verificación:</Label>
                <RadioGroup
                  value={filters.verified ? "true" : "false"}
                  onValueChange={(value) =>
                    handleFilterChange("verified", value === "true")
                  }
                  className="flex space-x-4"
                >
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="true" id="verified-true" />
                    <Label htmlFor="verified-true">Verificadas</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="false" id="verified-false" />
                    <Label htmlFor="verified-false">No verificadas</Label>
                  </div>
                </RadioGroup>
              </div>

              <div className="flex items-center space-x-2">
                <Checkbox
                  id="emptyChildren"
                  checked={filters.emptyChildren}
                  onCheckedChange={() => handleFilterChange("emptyChildren")}
                />
                <Label htmlFor="emptyChildren">Sin hijos asociados</Label>
              </div>

              <div className="flex items-center space-x-2">
                <Checkbox
                  id="pendingOrders"
                  checked={filters.pendingOrders}
                  onCheckedChange={() => handleFilterChange("pendingOrders")}
                />
                <Label htmlFor="pendingOrders">
                  Con pedidos pendientes o fallados
                </Label>
              </div>
            </div>
          </CardContent>
          <CardFooter>
            <Button
              onClick={handleSubmit}
              disabled={loading}
              className="w-full"
            >
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Procesando
                </>
              ) : (
                "Buscar emails"
              )}
            </Button>
          </CardFooter>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Resultados</CardTitle>
            <CardDescription>
              {emails.length} emails encontrados
            </CardDescription>
          </CardHeader>
          <CardContent>
            {emails.length > 0 ? (
              <Textarea
                className="font-mono text-xs h-36 max-h-36 overflow-auto"
                value={emails.join(separator === "semicolon" ? "; " : ", ")}
                readOnly
              />
            ) : (
              <p className="text-muted-foreground text-center py-8">
                No hay resultados que mostrar
              </p>
            )}

            <div className="flex items-center space-x-4 mt-4">
              <Label>Formato:</Label>
              <RadioGroup
                value={separator}
                onValueChange={(value) =>
                  setSeparator(value as "semicolon" | "comma")
                }
                className="flex space-x-4"
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="semicolon" id="semicolon" />
                  <Label htmlFor="semicolon">Punto y coma (;)</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="comma" id="comma" />
                  <Label htmlFor="comma">Coma (,)</Label>
                </div>
              </RadioGroup>
            </div>
          </CardContent>
          <CardFooter>
            <Button
              variant="outline"
              onClick={copyToClipboard}
              disabled={emails.length === 0 || copied}
              className="w-full"
            >
              {copied ? (
                <>
                  <Check className="mr-2 h-4 w-4" />
                  Copiado
                </>
              ) : (
                <>
                  <Copy className="mr-2 h-4 w-4" />
                  Copiar al portapapeles
                </>
              )}
            </Button>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}
