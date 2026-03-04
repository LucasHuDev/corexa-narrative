export default function GridOverlay({ variant = "default" }) {
  return (
    <div className={`gridOverlay gridOverlay--${variant}`} aria-hidden="true" />
  );
}
