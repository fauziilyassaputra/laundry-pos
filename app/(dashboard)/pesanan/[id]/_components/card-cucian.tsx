import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { createClient } from "@/lib/supabase/client";
import { useQuery } from "@tanstack/react-query";

export default function CardCucian({ id }: { id: string }) {
  const supabase = createClient();

  const { data: pesananData, isLoading: loadpesanan } = useQuery({
    queryKey: ["pesanan_list", id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("pesanan")
        .select("id_pesanan, id_pelanggan, status_pesanan, total_harga")
        .eq("id_pesanan", id);

      if (error) throw error;
      return data;
    },
  });

  const { data: pelangganData, isLoading: loadpelanggan } = useQuery({
    queryKey: ["pelanggan_list", pesananData?.[0].id_pelanggan],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("pelanggan")
        .select("nama_pelanggan")
        .eq("id_pelanggan", pesananData?.[0].id_pelanggan);

      if (error) throw error;
      return data;
    },
    enabled: !!pesananData?.[0]?.id_pelanggan,
  });

  const { data: pembayaranData, isLoading: loadpembayaran } = useQuery({
    queryKey: ["pembayaran_list", pesananData?.[0]?.id_pesanan],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("pembayaran")
        .select("id_pembayaran, status_pembayaran")
        .eq("id_pesanan", pesananData?.[0]?.id_pesanan);

      if (error) throw error;
      return data;
    },
    enabled: !!pesananData?.[0]?.id_pesanan,
  });
  console.log(pembayaranData);

  return (
    <Card className="w-full shadow-sm">
      <CardHeader>
        <CardTitle className="text-xl font-bold">Informasi Cucian</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="space-y-2">
            <Label>Nama pelanggan</Label>
            <Input
              value={
                loadpelanggan
                  ? "Loading..."
                  : pelangganData?.[0]?.nama_pelanggan || ""
              }
              disabled
            />
          </div>
          <div className="space-y-2">
            <Label>Status Pesanan</Label>
            <Input
              value={
                loadpesanan
                  ? "Loading..."
                  : pesananData?.[0].status_pesanan || ""
              }
              disabled
            />
          </div>
        </div>
        <Separator />
        <div className="space-y-4">
          <h3 className="text-md font-semibold">Ringkasan Pembayaran</h3>
          <div className="space-y-2">
            <p>
              Status Pembayaran:
              <span className="font-semibold">
                <br />
                {loadpembayaran
                  ? "Loading..."
                  : pembayaranData?.[0]?.status_pembayaran || ""}
              </span>
            </p>
          </div>
          <Separator />
          <div className="">
            <p>
              Total Harga:
              <span className="font-semibold">
                <br />
                Rp.
                {loadpesanan
                  ? "Loading..."
                  : pesananData?.[0].total_harga || ""}
              </span>
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
