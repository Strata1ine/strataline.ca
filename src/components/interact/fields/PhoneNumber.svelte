<script>
  import Input from "./Input.svelte";
  let { name = "Phone number" } = $props();
</script>

<Input
  {name}
  inputmode="tel"
  pattern={String.raw`^\([0-9]{3}\) [0-9]{3}-[0-9]{4}$`}
  placeholder="(xxx) xxx-xxxx"
  validate={true}
  oninput={(e) => {
    const t = e.currentTarget;
    let newValue = t.value.replace(/\D/g, "");
    let pos = t.selectionStart || 0;

    if (newValue.length == 4 || newValue.length == 7) {
      pos += 3;
    }

    if (newValue.length > 3 && newValue.length <= 6) {
      newValue = `(${newValue.slice(0, 3)}) ${newValue.slice(3)}`;
    } else if (newValue.length > 6) {
      newValue = `(${newValue.slice(0, 3)}) ${newValue.slice(3, 6)}-${newValue.slice(6, 10)}`;
    }

    t.value = newValue;
    t.setSelectionRange(pos, pos);
  }}
/>
