<script>
  import Modal from "@/components/modals/Modal.svelte";
  import Form from "@/components/modals/Form.svelte";
  import Input from "@/components/fields/Input.svelte";
  import Select from "@/components/fields/Select.svelte";
  import Photos from "@/components/fields/Photos.svelte";
  import TextArea from "@/components/fields/TextArea.svelte";
  import PhoneNumber from "@/components/fields/PhoneNumber.svelte";
  import StarSlider from "@/components/fields/StarSlider.svelte";

  import { actionStyles } from "@/components/actions/styles";
  import { modals, genUid } from "@/frontend/stores.svelte";
  import { modalStyles } from "./styles";
  import business from "#/business.json";

  const talkUid = genUid();
  let talkModal = $derived(modals.is(modals.talk));
  const reviewUid = genUid();
  let reviewModal = $derived(modals.is(modals.review));
</script>

<svelte:window
  onkeydown={(e) => {
    if (e.ctrlKey && e.key === "/") {
      e.preventDefault();
      modals.open(modals.talk);
    }
  }}
/>

<Modal
  bind:open={talkModal}
  uid={talkUid}
  class={modalStyles({ background: "blur", overlay: true, open: talkModal })}
>
  <Form
    action="/submissions/talk"
    name="contact"
    title="Let's talk"
    id={talkUid}
    class="space-y-8"
  >
    <p class="mt-2 desc-sm">
      Feel free to ask a question and/or quote.
    </p>

    <Input name="E-mail" required type="email" autocomplete="email" validate />
    <PhoneNumber validate></PhoneNumber>
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
    action="/submissions/review"
    name="review"
    title="Write a review"
    id={reviewUid}
    class="space-y-4"
  >
    <p class="mt-2 desc-sm italic">*We will verify your submission via email.</p>

    <StarSlider />
    <Input name="Full name" required type="name" autocomplete="name" />
    <Input name="E-mail" required type="email" autocomplete="email" validate />
    <Select
      name="Location"
      values={["Select a location", ...business.areaServed]}
      required
    />

    <TextArea required minlength="25" name="Review" />

    <button
      value="submit"
      class={actionStyles({ display: "fill", background: "fill" })}
    >
      Submit
    </button>
  </Form>
</Modal>
