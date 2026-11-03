// The core build (no plugins) has no own typings: reuse the main package ones.
declare module "sortablejs/modular/sortable.core.esm.js" {
  import Sortable from "sortablejs";
  export default Sortable;
}
