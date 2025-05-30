<script>
  import Input from "./Input.svelte";
  let { required = false, name, ...slot } = $props();
</script>

<Input as="textarea" {name} {required} {...slot} />
