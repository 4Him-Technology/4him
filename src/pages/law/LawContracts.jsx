import { useState } from "react";
import { FileSignature, ChevronLeft, Download, Loader2, Eye } from "lucide-react";
import { Button } from "@/components/ui/button";
import ContractTemplateList from "@/components/law/ContractTemplateList";
import ContractForm from "@/components/law/ContractForm";
import ContractPreview from "@/components/law/ContractPreview";

export default function LawContracts() {
  const [step, setStep] = useState("list"); // list | form | preview
  const [selectedTemplate, setSelectedTemplate] = useState(null);
  const [filledData, setFilledData] = useState(null);

  function handleSelectTemplate(template) {
    setSelectedTemplate(template);
    setStep("form");
  }

  function handleFormSubmit(data) {
    setFilledData(data);
    setStep("preview");
  }

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center gap-3">
        {step !== "list" && (
          <button
            onClick={() => setStep(step === "preview" ? "form" : "list")}
            className="p-1.5 rounded-lg hover:bg-muted transition-colors"
          >
            <ChevronLeft className="w-5 h-5 text-muted-foreground" />
          </button>
        )}
        <div className="w-10 h-10 rounded-xl bg-amber-700/10 flex items-center justify-center">
          <FileSignature className="w-5 h-5 text-amber-700" />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-foreground">Contratos</h1>
          <p className="text-sm text-muted-foreground">
            {step === "list" && "Escolha um template para gerar seu contrato"}
            {step === "form" && `Preencha os campos — ${selectedTemplate?.name}`}
            {step === "preview" && "Revise e exporte o contrato"}
          </p>
        </div>
      </div>

      {step === "list" && (
        <ContractTemplateList onSelect={handleSelectTemplate} />
      )}

      {step === "form" && selectedTemplate && (
        <ContractForm
          template={selectedTemplate}
          onSubmit={handleFormSubmit}
          onBack={() => setStep("list")}
        />
      )}

      {step === "preview" && selectedTemplate && filledData && (
        <ContractPreview
          template={selectedTemplate}
          data={filledData}
          onEdit={() => setStep("form")}
        />
      )}
    </div>
  );
}