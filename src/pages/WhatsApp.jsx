export default function WhatsApp() {
  return (
    <div className="h-full w-full flex flex-col" style={{ height: 'calc(100vh - 64px)' }}>
      <iframe
        src="https://forhim-chatwoot.cloudfy.live"
        className="w-full flex-1 border-0"
        style={{ height: '100%', minHeight: '600px' }}
        allow="microphone; camera; clipboard-read; clipboard-write"
        title="Chatwoot"
      />
    </div>
  );
}