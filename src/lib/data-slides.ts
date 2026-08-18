const ANIMATION_MS = 100;

/**
 * Vertical panel navigation of the DATA page: the arrows swap which
 * `[data-slide]` panel is visible, fading the incoming one in.
 */
export const initDataSlides = (): void => {
  const panels = Array.from(document.querySelectorAll<HTMLElement>('[data-slide]'));
  const up = document.querySelector<HTMLButtonElement>('#arrow-up');
  const down = document.querySelector<HTMLButtonElement>('#arrow-down');
  if (panels.length < 2 || !up || !down) return;

  let visible = 0;

  const show = (next: number, animation: 'fade-in-down' | 'fade-in-up') => {
    const current = panels[visible];
    const target = panels[next];
    if (!current || !target) return;

    up.disabled = true;
    down.disabled = true;

    current.classList.add('hidden');
    target.classList.add(animation);
    target.classList.remove('hidden');
    visible = next;

    up.classList.toggle('hidden', visible === 0);
    down.classList.toggle('hidden', visible === panels.length - 1);

    setTimeout(() => {
      target.classList.remove(animation);
      up.disabled = false;
      down.disabled = false;
    }, ANIMATION_MS);
  };

  down.addEventListener('click', () => {
    if (visible < panels.length - 1) show(visible + 1, 'fade-in-down');
  });

  up.addEventListener('click', () => {
    if (visible > 0) show(visible - 1, 'fade-in-up');
  });
};
