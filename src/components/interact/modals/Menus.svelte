<script>
  import Modal from "@modals/Modal.svelte";
  import Form from "@modals/Form.svelte";
  import Button from "@actions/Button.svelte";
  import Input from "@fields/Input.svelte";
  import Select from "@fields/Select.svelte";
  import Photos from "@fields/Photos.svelte";
  import TextArea from "@fields/TextArea.svelte";
  import PhoneNumber from "@fields/PhoneNumber.svelte";

  import { modals, getUid } from "~/frontend/stores";
  import config from "/content/business.json";

  let uid = getUid();
</script>

<Modal {uid} variant={{ intent: "blur", overlay: true }} idx={modals.talk}>
  <Form name="contact" title="Let's talk" id={uid} class="mt-8 space-y-9">
    <Input name="E-mail" required type="email" validate />
    <PhoneNumber validate required></PhoneNumber>
    <Select
      name="Location"
      values={["Select a location", ...config.areaServed]}
    />
    <TextArea required minlength="14" name="Message" />
    <Photos />
    <Button value="submit" variant={{ intent: "fill", display: "fill" }}>
      Submit
    </Button>
  </Form>
</Modal>
