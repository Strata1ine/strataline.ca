<script>
  const { open = $bindable() } = $props();
</script>

<div class="burger pointer-events-none" class:open></div>

<style lang="scss">
  .burger {
    position: relative;

    &::after,
    &::before {
      content: "";
      position: absolute;
      top: 50%;
      left: 0;
      right: 0;
      background: var(--color-black);
      height: 2px;
      transform-origin: center;
      transition:
        transform 250ms ease,
        left 250ms ease;
    }

    &::before {
      transform: translateY(-7px);
    }

    &::after {
      transform: translateY(7px);
      left: 30%;
    }

    &.open {
      &::after {
        transform: rotate(45deg);
        left: 0;
      }

      &::before {
        transform: rotate(-45deg);
      }
    }
  }
</style>
