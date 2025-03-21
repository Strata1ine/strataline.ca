export default function Img({ src, alt, extraProps }) {
  return <img src={src.src} alt={alt} {...extraProps} />;
}
