<script>
  import Modal from "@modals/Modal.svelte";
  import Form from "@modals/ModalForm.svelte";
  import Button from "@actions/Button.svelte";
  import Input from "@fields/Input.svelte";
  import Select from "@fields/Select.svelte";
  // import Photos from "@fields/Photos.svelte";
  // import TextArea from "@fields/TextArea.svelte";
  // import PhoneNumber from "@fields/PhoneNumber.svelte";

  import { modals } from "~/lib/stores";
  import config from "~/content/config.json";
</script>

<Modal varaint={{ intent: "blur" }} class="z-50" idx={modals.talk}>
  <Form class="mt-8 space-y-10" title="Let's talk">
    <Input name="E-mail" required autocomplete="on" type="email" validate />
    <!-- <PhoneNumber /> -->
    <Select
      name="Location"
      values={["Select a location", ...config.areaServed]}
    />
    <!-- <TextArea required minlength="14" class="min-h-30" name="Message" /> -->
    <!---->
    <!-- <Photos /> -->
    <!---->
    <Button value="submit" variant={{ intent: "fill", display: "full" }}>
      Submit
    </Button>
  </Form>
</Modal>
