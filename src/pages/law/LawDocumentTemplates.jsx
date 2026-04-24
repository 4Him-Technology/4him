import { useState } from "react";
import { Gavel, ChevronLeft } from "lucide-react";
import DocumentTemplateList from "@/components/law/documents/DocumentTemplateList";
import DocumentTemplateForm from "@/components/law/documents/DocumentTemplateForm";
import DocumentTemplatePreview from "@/components/law/documents/DocumentTemplatePreview";

export default function LawDocumentTemplates() {
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
          <Gavel className="w-5 h-5 text-amber-700" />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-foreground">Peças Processuais</h1>
          <p className="text-sm text-muted-foreground">
            {step === "list" && "Templates prontos com campos variáveis e integração com processos"}
            {step === "form" && `Preencha os campos — ${selectedTemplate?.name}`}
            {step === "preview" && "Revise e exporte a peça"}
          </p>
        </div>
      </div>

      {step === "list" && (
        <DocumentTemplateList onSelect={handleSelectTemplate} />
      )}

      {step === "form" && selectedTemplate && (
        <DocumentTemplateForm
          template={selectedTemplate}
          onSubmit={handleFormSubmit}
          onBack={() => setStep("list")}
        />
      )}

      {step === "preview" && selectedTemplate && filledData && (
        <DocumentTemplatePreview
          template={selectedTemplate}
          data={filledData}
          onEdit={() => setStep("form")}
        />
      )}
    </div>
  );
}