import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { MainLayout } from "@/components/layout/MainLayout";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Package, Plus, Search, Download, ExternalLink, Shield, Zap,
  Eye, Hash, Star, TrendingUp, Lock, CheckCircle2, Globe, AlertTriangle
} from "lucide-react";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription
} from "@/components/ui/dialog";

interface Product {
  id: string;
  name: string;
  slug: string;
  short_description: string | null;
  category: string | null;
  version: string | null;
  price: number;
  status: string;
  featured: boolean;
  trending: boolean;
  thumbnail_url: string | null;
  apk_url: string | null;
  demo_url: string | null;
  demo_enabled: boolean;
  demo_login_id: string | null;
  demo_password: string | null;
  license_enabled: boolean;
  require_payment: boolean;
  secure_download: boolean;
  app_hash: string | null;
  package_name: string | null;
  tags_json: string[];
  created_at: string;
}

export default function ProductCatalog() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [demoDialog, setDemoDialog] = useState<Product | null>(null);
  const [signingId, setSigningId] = useState<string | null>(null);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase.from("products").select("*").order("created_at", { ascending: false });
      if (error) throw error;
      setProducts((data || []) as Product[]);
    } catch (err: any) {
      toast({ title: "Failed to load products", description: err.message, variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  const filtered = products.filter(p =>
    p.name.toLowerCase().includes(search.toLowerCase()) ||
    (p.category || "").toLowerCase().includes(search.toLowerCase()) ||
    (p.package_name || "").toLowerCase().includes(search.toLowerCase())
  );

  const handleSecureDownload = async (product: Product) => {
    if (!product.apk_url) {
      toast({ title: "Download Unavailable", description: "APK file not found in storage", variant: "destructive" });
      return;
    }
    if (product.require_payment) {
      toast({ title: "Payment Required", description: "Complete payment to unlock download", variant: "destructive" });
      return;
    }
    setSigningId(product.id);
    try {
      // Generate signed URL via edge function
      const res = await supabase.functions.invoke("secure-download", {
        body: { product_id: product.id, product_slug: product.slug }
      });
      if (res.error) throw res.error;
      const { signed_url } = res.data;
      // Log the download
      await supabase.from("download_logs").insert({
        product_id: product.id,
        status: "success",
        user_agent: navigator.userAgent,
      });
      window.open(signed_url, "_blank");
      toast({ title: "Download Started", description: "Signed URL valid for 5 minutes" });
    } catch (err: any) {
      toast({ title: "Download Failed", description: err.message, variant: "destructive" });
      await supabase.from("download_logs").insert({
        product_id: product.id,
        status: "blocked",
        user_agent: navigator.userAgent,
      });
    } finally {
      setSigningId(null);
    }
  };

  const handleDemoClick = async (product: Product) => {
    // Log demo click
    await supabase.from("products").update({ demo_click_count: (product as any).demo_click_count + 1 }).eq("id", product.id);
    if (product.demo_login_id || product.demo_password) {
      setDemoDialog(product);
    } else {
      window.open(product.demo_url!, "_blank");
    }
  };

  return (
    <MainLayout title="Product Catalog" subtitle="Software Vala™ marketplace">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center">
              <Package className="h-5 w-5 text-primary" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-foreground">Product Catalog</h1>
              <p className="text-sm text-muted-foreground">{products.length} products — Software Vala™</p>
            </div>
          </div>
          <Button onClick={() => navigate("/admin/add-product")}>
            <Plus className="h-4 w-4 mr-2" />Add Product
          </Button>
        </div>

        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input placeholder="Search products, categories, packages…" className="pl-9" value={search} onChange={e => setSearch(e.target.value)} />
        </div>

        {/* Stats */}
        <div className="grid grid-cols-4 gap-4">
          {[
            { label: "Total Products", value: products.length, icon: Package, color: "text-primary" },
            { label: "Active", value: products.filter(p => p.status === "active").length, icon: CheckCircle2, color: "text-green-500" },
            { label: "Featured", value: products.filter(p => p.featured).length, icon: Star, color: "text-amber-500" },
            { label: "With APK", value: products.filter(p => p.apk_url).length, icon: Download, color: "text-blue-500" },
          ].map(s => (
            <Card key={s.label}>
              <CardContent className="pt-4 pb-3">
                <div className="flex items-center gap-3">
                  <s.icon className={`h-5 w-5 ${s.color}`} />
                  <div>
                    <p className="text-2xl font-bold">{s.value}</p>
                    <p className="text-xs text-muted-foreground">{s.label}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Products grid */}
        {loading ? (
          <div className="grid grid-cols-3 gap-4">
            {[1,2,3].map(i => <Card key={i} className="h-64 animate-pulse bg-muted" />)}
          </div>
        ) : filtered.length === 0 ? (
          <Card className="p-12 text-center">
            <Package className="h-12 w-12 mx-auto mb-3 text-muted-foreground" />
            <p className="font-medium">No products yet</p>
            <p className="text-sm text-muted-foreground mb-4">Create your first product to get started</p>
            <Button onClick={() => navigate("/admin/add-product")}><Plus className="h-4 w-4 mr-2" />Add Product</Button>
          </Card>
        ) : (
          <div className="grid grid-cols-3 gap-4">
            {filtered.map(product => (
              <Card key={product.id} className="overflow-hidden hover:shadow-md transition-shadow">
                {/* Thumbnail */}
                <div className="h-40 bg-muted relative">
                  {product.thumbnail_url ? (
                    <img src={product.thumbnail_url} alt={product.name} className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <Package className="h-12 w-12 text-muted-foreground/30" />
                    </div>
                  )}
                  {/* Badges */}
                  <div className="absolute top-2 left-2 flex gap-1">
                    {product.featured && <Badge className="text-xs bg-amber-500"><Star className="h-3 w-3 mr-0.5" />Featured</Badge>}
                    {product.trending && <Badge className="text-xs bg-purple-500"><TrendingUp className="h-3 w-3 mr-0.5" />Trending</Badge>}
                  </div>
                  <div className="absolute top-2 right-2">
                    <Badge variant={product.status === "active" ? "default" : "secondary"} className="text-xs capitalize">{product.status}</Badge>
                  </div>
                  {/* Software Vala watermark */}
                  <div className="absolute bottom-2 right-2 text-[10px] text-white/70 bg-black/40 px-1.5 py-0.5 rounded">
                    Software Vala™
                  </div>
                </div>

                <CardContent className="pt-3 pb-4 space-y-2">
                  <div>
                    <h3 className="font-semibold text-sm leading-tight">{product.name}</h3>
                    {product.short_description && (
                      <p className="text-xs text-muted-foreground mt-0.5 line-clamp-2">{product.short_description}</p>
                    )}
                  </div>

                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    {product.category && <Badge variant="outline" className="text-xs">{product.category}</Badge>}
                    {product.version && <span>v{product.version}</span>}
                  </div>

                  {/* Security indicators */}
                  <div className="flex items-center gap-2 text-xs">
                    {product.license_enabled && (
                      <span className="flex items-center gap-0.5 text-green-600"><Shield className="h-3 w-3" />Licensed</span>
                    )}
                    {product.secure_download && (
                      <span className="flex items-center gap-0.5 text-blue-600"><Lock className="h-3 w-3" />Signed URL</span>
                    )}
                    {product.app_hash && (
                      <span className="flex items-center gap-0.5 text-amber-600"><Hash className="h-3 w-3" />Hash</span>
                    )}
                  </div>

                  {/* Price */}
                  <div className="flex items-center justify-between pt-1">
                    <span className="font-bold text-primary">
                      {product.price === 0 ? "Free" : `₹${product.price.toLocaleString()}`}
                    </span>
                    {product.require_payment && <Badge variant="outline" className="text-xs"><Lock className="h-3 w-3 mr-0.5" />Pay to Download</Badge>}
                  </div>

                  {/* APK hash */}
                  {product.app_hash && (
                    <div className="bg-muted/50 rounded p-1.5 text-xs font-mono text-muted-foreground truncate">
                      SHA256: {product.app_hash.substring(0, 24)}…
                    </div>
                  )}

                  {/* Action buttons */}
                  <div className="flex gap-2 pt-1">
                    {product.apk_url ? (
                      <Button
                        size="sm" className="flex-1 text-xs"
                        onClick={() => handleSecureDownload(product)}
                        disabled={signingId === product.id}
                      >
                        <Download className="h-3 w-3 mr-1" />
                        {signingId === product.id ? "Signing…" : product.require_payment ? "Buy & Download" : "Download"}
                      </Button>
                    ) : (
                      <Button size="sm" className="flex-1 text-xs" variant="outline" disabled>
                        <AlertTriangle className="h-3 w-3 mr-1" />No APK
                      </Button>
                    )}
                    {product.demo_enabled && product.demo_url && (
                      <Button size="sm" variant="outline" className="text-xs" onClick={() => handleDemoClick(product)}>
                        <Globe className="h-3 w-3 mr-1" />Demo
                      </Button>
                    )}
                    <Button size="sm" variant="ghost" className="text-xs px-2" onClick={() => navigate(`/admin/products/${product.id}`)}>
                      <Eye className="h-3 w-3" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>

      {/* Demo credentials dialog */}
      <Dialog open={!!demoDialog} onOpenChange={() => setDemoDialog(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Globe className="h-5 w-5 text-primary" />
              Live Demo — {demoDialog?.name}
            </DialogTitle>
            <DialogDescription>Use these credentials to access the demo environment</DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="bg-muted/50 rounded-lg p-4 space-y-3">
              <div>
                <p className="text-xs text-muted-foreground">Demo URL</p>
                <a href={demoDialog?.demo_url || "#"} target="_blank" rel="noopener noreferrer"
                  className="text-sm text-primary hover:underline flex items-center gap-1">
                  {demoDialog?.demo_url}<ExternalLink className="h-3 w-3" />
                </a>
              </div>
              {demoDialog?.demo_login_id && (
                <div>
                  <p className="text-xs text-muted-foreground">Login ID</p>
                  <code className="text-sm font-mono">{demoDialog.demo_login_id}</code>
                </div>
              )}
              {demoDialog?.demo_password && (
                <div>
                  <p className="text-xs text-muted-foreground">Password</p>
                  <code className="text-sm font-mono">{demoDialog.demo_password}</code>
                </div>
              )}
            </div>
            <div className="text-xs text-muted-foreground flex items-center gap-1">
              <Shield className="h-3 w-3" />
              Demo access does not expose license API or production data
            </div>
            <Button className="w-full" onClick={() => { window.open(demoDialog?.demo_url!, "_blank"); setDemoDialog(null); }}>
              <ExternalLink className="h-4 w-4 mr-2" />Open Demo
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </MainLayout>
  );
}
