<script>
  import Modal from "@modals/Modal.svelte";
  import Form from "@modals/Form.svelte";
  import Input from "@fields/Input.svelte";
  import Select from "@fields/Select.svelte";
  import Photos from "@fields/Photos.svelte";
  import TextArea from "@fields/TextArea.svelte";
  import PhoneNumber from "@fields/PhoneNumber.svelte";

  import { modals, genUid } from "~/frontend/stores";
  import { modalStyles } from "./styles";
  import business from "@root/content/business.json";
  import { actionStyles } from "@actions/styles";

  let talkUid = genUid();
  let talkModal = $state(false);
  modals.idx.subscribe((v) => (talkModal = modals.talk == v));
</script>

<Modal
  bind:open={talkModal}
  uid={talkUid}
  class={modalStyles({ background: "blur", overlay: true, open: talkModal })}
>
  <Form name="contact" title="Let's talk" id={talkUid} class="mt-8 space-y-9">
    <Input name="E-mail" required type="email" validate />
    <PhoneNumber validate required></PhoneNumber>
    <Select
      name="Location"
      values={["Select a location", ...business.areaServed]}
    />
    <TextArea required minlength="14" name="Message" />
    <Photos />
    <button
      value="submit"
      class={actionStyles({ display: "fill", background: "fill" })}
    >
      Submit
    </button>
  </Form>
</Modal>
