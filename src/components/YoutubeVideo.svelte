<script lang="ts">
  import { onMount } from "svelte";
  import { get } from "svelte/store";
  import { videoPlaying, youtubeApiReady } from "@/frontend/stores.svelte";

  const { id }: { id: string } = $props();
  let video: HTMLDivElement;

  onMount(() => {
    // load youtube API if it doesn't exist or is being loaded
    if (!window.YT && get(youtubeApiReady) != null) {
      youtubeApiReady.set(null);
      var tag = document.createElement("script");
      tag.src = "https://www.youtube.com/iframe_api";
      document.head.insertBefore(tag, document.head.firstChild);

      window.onYouTubeIframeAPIReady = function () {
        youtubeApiReady.set(true);
      };
    }

    let unsubVideo: (() => void) | undefined;
    let player: YT.Player;

    const unsubPlayer = youtubeApiReady.subscribe((ready) => {
      if (ready) {
        const YT = window.YT;
        player = new YT.Player(video, {
          height: "100%",
          width: "100%",
          videoId: id,
          playerVars: {
            rel: 0,
          },
          events: {
            onReady: () => {
              unsubVideo = videoPlaying.subscribe((isPlaying) => {
                if (
                  !isPlaying &&
                  player.getPlayerState() === YT.PlayerState.PLAYING
                ) {
                  player.pauseVideo();
                }
              });
            },
            onError: (event) => {
              console.error("YouTube player error: ", event.data);
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
      unsubPlayer();
      unsubVideo?.();
      if (player && player.destroy) {
        player.destroy();
      }
    };
  });
</script>

<div class="select-none" bind:this={video}></div>
