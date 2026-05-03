import ItemCucianManagement from "./_components/item_cucian";

export const metadata = {
  title: "POS Laundry | Detail Pesanan",
};

export default async function ItemCucianPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  return (
    <div className="">
      <ItemCucianManagement id={id} />
    </div>
  );
}
