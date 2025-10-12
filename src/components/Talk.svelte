<script>
  import Mailbox from "@/icons/ph/mailbox-fill.svelte";

  import { modals } from "@/frontend/stores.svelte";
  import { actionStyles } from "@/components/actions/styles";
</script>

<button
  class="{actionStyles({
    variant: 'pill',
    background: 'accent',
  })} fixed right-5 bottom-7 z-1 flex items-center justify-center sm:right-13 sm:bottom-15"
  onclick={() => modals.open(modals.talk)}
>
  <Mailbox class="size-11" />
</button>
