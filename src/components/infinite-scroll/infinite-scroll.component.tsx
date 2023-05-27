import { Fragment, useCallback, useEffect } from "react";

const InfiniteScroll = ({
  loadMore,
  reset,
}: {
  loadMore: () => void;
  reset?: boolean;
}) => {
  const handleScroll = useCallback(
    (event: Event) => {
      const table = event.target as HTMLTableElement;
      const maxScroll = table?.scrollHeight - table?.clientHeight;
      const currentScroll = table?.scrollTop;

      if (currentScroll === maxScroll) {
        loadMore();
      }
    },
    [loadMore]
  );

  useEffect(() => {
    const table = document.querySelector(".ant-table-body");

    if (reset) {
      table?.scroll({ top: 0 });
    }

    table?.addEventListener("scroll", handleScroll);

    return () => table?.removeEventListener("scroll", handleScroll);
  }, [handleScroll, reset]);

  return <Fragment />;
};

export default InfiniteScroll;
