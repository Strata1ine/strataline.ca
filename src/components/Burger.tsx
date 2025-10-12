export default function Burger(props: { open: boolean }) {
  return (
    <div 
      class="burger pointer-events-none"
      classList={{ open: props.open }}
    />
  );
}
