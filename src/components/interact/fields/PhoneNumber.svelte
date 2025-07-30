<script>
  import Input from "./Input.svelte";
  let { name = "Phone number", validate, required } = $props();
</script>

<Input
  {validate}
  {name}
  {required}
  inputmode="tel"
  autocomplete="tel"
  pattern={String.raw`^\([0-9]{3}\) [0-9]{3}-[0-9]{4}$`}
  placeholder="(xxx) xxx-xxxx"
  oninput={(e) => {
    let newValue = e.currentTarget.value.replace(/\D/g, "");
    let pos = e.currentTarget.selectionStart || 0;

    if (newValue.length == 4 || newValue.length == 7) {
      pos += 3;
    }

    if (newValue.length > 3 && newValue.length <= 6) {
      newValue = `(${newValue.slice(0, 3)}) ${newValue.slice(3)}`;
    } else if (newValue.length > 6) {
      newValue = `(${newValue.slice(0, 3)}) ${newValue.slice(3, 6)}-${newValue.slice(6, 10)}`;
    }

    e.currentTarget.value = newValue;
    e.currentTarget.setSelectionRange(pos, pos);
  }}
></Input>
