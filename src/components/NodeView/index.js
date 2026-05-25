/**
 * NodeView — lenses for corpus nodes.
 *
 * A NodeView is a presentational React component that renders one corpus
 * node (text, image, audio, video, multi, …) inside a host container. The
 * lenses are pure: they don't manage state, don't bind events, and don't
 * know about the surrounding graph or reader. The host gives them an
 * article, a size, and a view state — they return JSX.
 *
 * Conceptually: a `kind` field on the node dispatches to a specific lens.
 *   kind === 'text' | 'essay' | 'fragment' | 'multi'  → <TextView/>
 *   kind === 'image'                                  → <ImageView/>   (future)
 *   kind === 'podcast-episode'                        → <AudioView/>   (future)
 *   kind === 'video'                                  → <VideoView/>   (future)
 *
 * For now `<TextView/>` also handles image-kind nodes via an internal
 * variant; that will move to a dedicated lens once the second substrate
 * grows beyond a single visual.
 */
export { TextView } from './TextView';
