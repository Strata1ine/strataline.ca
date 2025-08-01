<script>
  import Modal from "@modals/Modal.svelte";
  import Form from "@modals/Form.svelte";
  import Input from "@fields/Input.svelte";
  import Select from "@fields/Select.svelte";
  import Photos from "@fields/Photos.svelte";
  import TextArea from "@fields/TextArea.svelte";
  import PhoneNumber from "@fields/PhoneNumber.svelte";

  import { modals, genUid } from "~/frontend/stores.svelte";
  import { modalStyles } from "./styles";
  import business from "@root/content/business.json";
  import { actionStyles } from "@actions/styles";

  const talkUid = genUid();
  let talkModal = $derived(modals.is(modals.talk));
  const reviewUid = genUid();
  let reviewModal = $derived(modals.is(modals.review));
</script>

<Modal
  bind:open={talkModal}
  uid={talkUid}
  class={modalStyles({ background: "blur", overlay: true, open: talkModal })}
>
  <Form name="contact" title="Let's talk" id={talkUid} class="space-y-9">
    <Input name="E-mail" required type="email" autocomplete="email" validate />
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

<Modal
  bind:open={reviewModal}
  uid={reviewUid}
  class={modalStyles({ background: "blur", overlay: true, open: reviewModal })}
>
  <Form
    name="review"
    title="Write a review"
    id={reviewUid}
    class="space-y-8"
  >
    <Input name="Full name" required type="name" autocomplete="name" />
    <Input name="E-mail" required type="email" autocomplete="email" validate />
    <Select
      name="Location"
      values={["Select a location", ...business.areaServed]}
      required
    />

    <TextArea required minlength="25" name="Review" />

    <p class="desc-base italic">*We will verify your submission via email.</p>

    <button
      value="submit"
      class={actionStyles({ display: "fill", background: "fill" })}
    >
      Submit
    </button>
  </Form>
</Modal>
