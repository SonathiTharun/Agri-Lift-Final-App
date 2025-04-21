
export default function DisclaimerBanner() {
  return (
    <div
      className="bg-amber-100 border-l-4 border-amber-400 text-amber-900 p-3 my-4 rounded"
      title="Disclaimer: AgriLift loan information"
      role="alert"
      aria-label="Disclaimer Banner"
    >
      <strong>Disclaimer:&nbsp;</strong>AgriLift does not offer loans directly.
      <span className="block text-sm mt-1">
        All financial information is for educational and informational purposes only.<br />
        Please contact each bank directly for official loan services.
      </span>
    </div>
  );
}
