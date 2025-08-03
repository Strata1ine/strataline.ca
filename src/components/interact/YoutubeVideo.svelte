<script lang="ts">
  import { onMount } from "svelte";
  import { videoPlaying, youtubeApiReady } from "~/frontend/stores.svelte";

  const { id }: { id: string } = $props();
  let video: HTMLIFrameElement;

  onMount(() => {
    let videoSub: (() => void) | undefined;
    let player: YT.Player;

    const unsubscribe = youtubeApiReady.subscribe((ready) => {
      if (ready) {
        const YT = window.YT;
        player = new YT.Player(video, {
          height: "100%",
          width: "100%",
          videoId: id,
          events: {
            onReady: () => {
              videoSub = videoPlaying.subscribe((isPlaying) => {
                if (
                  !isPlaying &&
                  player.getPlayerState() === YT.PlayerState.PLAYING
                ) {
                  player.pauseVideo();
                }
              });
            },
            onError: (event) => {
              console.error("YouTube player error:", event.data);
            },
            onStateChange: (event) => {
              if (event.data === YT.PlayerState.PLAYING) {
                videoPlaying.set(true);
              } else if (
                event.data === YT.PlayerState.PAUSED ||
                event.data === YT.PlayerState.ENDED
              ) {
                videoPlaying.set(false);
              }
            },
          },
        });
      }
    });

    return () => {
      unsubscribe();
      videoSub?.();
      if (player && player.destroy) {
        player.destroy();
      }
    };
  });
</script>

<div bind:this={video}></div>
