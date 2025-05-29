import { render } from "@build/components";

export const Content = (props: { components: any[] }) => {
  return render(props.components);
};
