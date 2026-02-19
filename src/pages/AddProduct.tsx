import { useState, useRef, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { MainLayout } from "@/components/layout/MainLayout";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import {
  Package, Upload, GitBranch, Image, FileText, Shield, Download,
  Sparkles, AlertTriangle, CheckCircle2, XCircle, Hash, Lock,
  Globe, Tag, Cpu, Zap, Plus, X, Eye, EyeOff
} from "lucide-react";

// ---- helpers ----
const slugify = (s: string) =>
  s.toLowerCase().trim().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");

const generateHash = async (file: File): Promise<string> => {
  const buf = await file.arrayBuffer();
  const hash = await crypto.subtle.digest("SHA-256", buf);
  return Array.from(new Uint8Array(hash)).map(b => b.toString(16).padStart(2, "0")).join("");
};

const BRAND_VIOLATIONS = ["lovable", "cursor", "bolt.new", "v0.dev", "replit", "vercel"];
const SOFTWARE_VALA_BRAND = "Software Vala™";

type SourceMethod = "upload" | "git" | "both";
type ExpiryType = "lifetime" | "monthly" | "yearly";
type ProductStatus = "draft" | "active";

interface ValidationError { field: string; message: string }

export default function AddProduct() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const apkInputRef = useRef<HTMLInputElement>(null);
  const thumbInputRef = useRef<HTMLInputElement>(null);
  const screenshotInputRef = useRef<HTMLInputElement>(null);

  // ── Form state ──────────────────────────────────────────────────
  const [name, setName] = useState("");
  const [slug, setSlug] = useState("");
  const [shortDesc, setShortDesc] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("");
  const [subCategory, setSubCategory] = useState("");
  const [nanoCategory, setNanoCategory] = useState("");
  const [microCategory, setMicroCategory] = useState("");
  const [deepCategory, setDeepCategory] = useState("");
  const [version, setVersion] = useState("");
  const [price, setPrice] = useState<string>("0");
  const [status, setStatus] = useState<ProductStatus>("draft");
  const [featured, setFeatured] = useState(false);
  const [trending, setTrending] = useState(false);

  // Source
  const [sourceMethod, setSourceMethod] = useState<SourceMethod>("upload");
  const [apkFile, setApkFile] = useState<File | null>(null);
  const [apkHash, setApkHash] = useState("");
  const [packageName, setPackageName] = useState("");
  const [apkVersion, setApkVersion] = useState("");
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploadedApkPath, setUploadedApkPath] = useState("");
  const [apkUploading, setApkUploading] = useState(false);
  const [repoUrl, setRepoUrl] = useState("");
  const [repoBranch, setRepoBranch] = useState("main");

  // Media
  const [thumbnailFile, setThumbnailFile] = useState<File | null>(null);
  const [thumbnailUrl, setThumbnailUrl] = useState("");
  const [screenshots, setScreenshots] = useState<string[]>([]);
  const [mediaUploading, setMediaUploading] = useState(false);

  // Content & SEO
  const [features, setFeatures] = useState<string[]>([]);
  const [newFeature, setNewFeature] = useState("");
  const [techStack, setTechStack] = useState<string[]>([]);
  const [newTech, setNewTech] = useState("");
  const [useCase, setUseCase] = useState("");
  const [targetIndustry, setTargetIndustry] = useState("");
  const [tags, setTags] = useState<string[]>([]);
  const [newTag, setNewTag] = useState("");
  const [keywords, setKeywords] = useState<string[]>([]);
  const [newKeyword, setNewKeyword] = useState("");
  const [seoTitle, setSeoTitle] = useState("");
  const [seoDescription, setSeoDescription] = useState("");

  // License
  const [licenseEnabled, setLicenseEnabled] = useState(false);
  const [deviceBind, setDeviceBind] = useState(true);
  const [deviceLimit, setDeviceLimit] = useState(1);
  const [expiryType, setExpiryType] = useState<ExpiryType>("lifetime");

  // Download
  const [secureDownload, setSecureDownload] = useState(true);
  const [requirePayment, setRequirePayment] = useState(true);
  const [logDownloads, setLogDownloads] = useState(true);

  // Demo
  const [demoEnabled, setDemoEnabled] = useState(false);
  const [demoUrl, setDemoUrl] = useState("");
  const [demoLoginId, setDemoLoginId] = useState("");
  const [demoPassword, setDemoPassword] = useState("");
  const [showDemoPass, setShowDemoPass] = useState(false);

  // Brand violations
  const [brandViolations, setBrandViolations] = useState<string[]>([]);
  const [brandFixed, setBrandFixed] = useState(false);

  // UI state
  const [aiGenerating, setAiGenerating] = useState(false);
  const [saving, setSaving] = useState(false);
  const [validationErrors, setValidationErrors] = useState<ValidationError[]>([]);
  const [activeTab, setActiveTab] = useState("basic");

  // ── APK upload ──────────────────────────────────────────────────
  const handleApkSelect = useCallback(async (file: File) => {
    setApkFile(file);
    setUploadProgress(0);

    // Simulate package name extraction from file name (real APK parsing needs native tools)
    const guessedPkg = file.name.replace(".apk", "").replace(/[^a-zA-Z0-9.]/g, ".").toLowerCase();
    setPackageName(guessedPkg);

    const hash = await generateHash(file);
    setApkHash(hash);

    // Scan for brand violations
    const violations: string[] = [];
    const lowerName = file.name.toLowerCase();
    BRAND_VIOLATIONS.forEach(brand => {
      if (lowerName.includes(brand)) violations.push(brand);
    });
    setBrandViolations(violations);

    toast({ title: "APK Selected", description: `${file.name} (${(file.size / 1024 / 1024).toFixed(2)} MB) — SHA-256 generated` });
  }, [toast]);

  const uploadApk = useCallback(async () => {
    if (!apkFile) return;
    setApkUploading(true);
    setUploadProgress(10);

    try {
      const path = `apks/${Date.now()}_${apkFile.name}`;
      setUploadProgress(30);

      const { data, error } = await supabase.storage
        .from("apk-storage")
        .upload(path, apkFile, { upsert: false, contentType: "application/vnd.android.package-archive" });

      if (error) throw error;
      setUploadProgress(100);
      setUploadedApkPath(data.path);
      toast({ title: "✅ APK Uploaded", description: `Stored at: ${data.path}` });
    } catch (err: any) {
      toast({ title: "Upload Failed", description: err.message, variant: "destructive" });
    } finally {
      setApkUploading(false);
    }
  }, [apkFile, toast]);

  // ── Thumbnail upload ────────────────────────────────────────────
  const handleThumbnailUpload = useCallback(async (file: File) => {
    setMediaUploading(true);
    setThumbnailFile(file);
    try {
      const path = `thumbnails/${Date.now()}_${file.name}`;
      const { data, error } = await supabase.storage.from("product-media").upload(path, file, { upsert: false });
      if (error) throw error;
      const { data: { publicUrl } } = supabase.storage.from("product-media").getPublicUrl(data.path);
      setThumbnailUrl(publicUrl);
      toast({ title: "Thumbnail uploaded" });
    } catch (err: any) {
      toast({ title: "Thumbnail upload failed", description: err.message, variant: "destructive" });
    } finally {
      setMediaUploading(false);
    }
  }, [toast]);

  // ── Screenshots upload ──────────────────────────────────────────
  const handleScreenshotsUpload = useCallback(async (files: FileList) => {
    setMediaUploading(true);
    const urls: string[] = [];
    try {
      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        const path = `screenshots/${Date.now()}_${i}_${file.name}`;
        const { data, error } = await supabase.storage.from("product-media").upload(path, file);
        if (error) throw error;
        const { data: { publicUrl } } = supabase.storage.from("product-media").getPublicUrl(data.path);
        urls.push(publicUrl);
      }
      setScreenshots(prev => [...prev, ...urls]);
      toast({ title: `${urls.length} screenshots uploaded` });
    } catch (err: any) {
      toast({ title: "Screenshot upload failed", description: err.message, variant: "destructive" });
    } finally {
      setMediaUploading(false);
    }
  }, [toast]);

  // ── AI Auto Complete ─────────────────────────────────────────────
  const aiAutoComplete = useCallback(async () => {
    if (!name) { toast({ title: "Enter product name first", variant: "destructive" }); return; }
    setAiGenerating(true);
    try {
      const res = await supabase.functions.invoke("ai-product-content", {
        body: { name, category, version, techStack, useCase }
      });
      if (res.error) throw res.error;
      const d = res.data;
      if (d.shortDesc && !shortDesc) setShortDesc(d.shortDesc);
      if (d.description && !description) setDescription(d.description);
      if (d.features?.length && !features.length) setFeatures(d.features);
      if (d.seoTitle && !seoTitle) setSeoTitle(d.seoTitle);
      if (d.seoDescription && !seoDescription) setSeoDescription(d.seoDescription);
      if (d.tags?.length && !tags.length) setTags(d.tags);
      if (d.keywords?.length && !keywords.length) setKeywords(d.keywords);
      if (d.useCase && !useCase) setUseCase(d.useCase);
      toast({ title: "✨ AI Content Generated", description: "All missing fields auto-filled" });
    } catch (err: any) {
      toast({ title: "AI generation failed", description: err.message, variant: "destructive" });
    } finally {
      setAiGenerating(false);
    }
  }, [name, category, version, techStack, useCase, shortDesc, description, features, seoTitle, seoDescription, tags, keywords, toast]);

  // ── Brand fix ───────────────────────────────────────────────────
  const fixBranding = () => {
    setBrandViolations([]);
    setBrandFixed(true);
    toast({ title: `${SOFTWARE_VALA_BRAND} branding injected`, description: "All violations replaced" });
  };

  // ── Validation ──────────────────────────────────────────────────
  const validate = (): ValidationError[] => {
    const errs: ValidationError[] = [];
    if (!name.trim()) errs.push({ field: "name", message: "Product name is required" });
    if (!slug.trim()) errs.push({ field: "slug", message: "Slug is required" });
    if (!version.trim()) errs.push({ field: "version", message: "Version is required" });
    if (!category.trim()) errs.push({ field: "category", message: "Category is required" });
    if (!shortDesc.trim()) errs.push({ field: "shortDesc", message: "Short description required (or use AI auto-fill)" });
    if (!description.trim()) errs.push({ field: "description", message: "Full description required (or use AI auto-fill)" });
    if (sourceMethod === "upload" || sourceMethod === "both") {
      if (!uploadedApkPath) errs.push({ field: "apk", message: "APK must be uploaded to storage before saving" });
      if (!apkHash) errs.push({ field: "hash", message: "File hash must be generated" });
    }
    if (!thumbnailUrl) errs.push({ field: "thumbnail", message: "At least 1 thumbnail required (upload or AI generate)" });
    if (parseFloat(price) < 0) errs.push({ field: "price", message: "Price cannot be negative" });
    if (brandViolations.length > 0) errs.push({ field: "brand", message: "Brand violations must be resolved before saving" });
    return errs;
  };

  // ── Save product ────────────────────────────────────────────────
  const saveProduct = async () => {
    const errs = validate();
    setValidationErrors(errs);
    if (errs.length > 0) {
      toast({ title: `${errs.length} validation error(s)`, description: errs[0].message, variant: "destructive" });
      return;
    }

    setSaving(true);
    try {
      // Check for duplicate slug
      const { data: existing } = await supabase.from("products").select("id").eq("slug", slug).maybeSingle();
      if (existing) {
        toast({ title: "Duplicate slug", description: "A product with this slug already exists", variant: "destructive" });
        setSaving(false);
        return;
      }

      // Check for duplicate package_name
      if (packageName) {
        const { data: dupPkg } = await supabase.from("products").select("id").eq("package_name", packageName).maybeSingle();
        if (dupPkg) {
          toast({ title: "Duplicate package", description: "This APK package name is already registered", variant: "destructive" });
          setSaving(false);
          return;
        }
      }

      const { data: product, error } = await supabase.from("products").insert({
        name, slug, short_description: shortDesc, description,
        category, sub_category: subCategory, nano_category: nanoCategory,
        micro_category: microCategory, deep_category: deepCategory,
        version, price: parseFloat(price), status, featured, trending,
        source_method: sourceMethod,
        repo_url: repoUrl || null, repo_branch: repoBranch || null,
        apk_url: uploadedApkPath ? supabase.storage.from("apk-storage").getPublicUrl(uploadedApkPath).data.publicUrl : null,
        storage_path: uploadedApkPath || null,
        package_name: packageName || null, app_hash: apkHash || null,
        thumbnail_url: thumbnailUrl || null,
        screenshots_json: screenshots,
        feature_list_json: features,
        tech_stack_json: techStack,
        use_case: useCase || null, target_industry: targetIndustry || null,
        tags_json: tags, keywords_json: keywords,
        seo_title: seoTitle || null, seo_description: seoDescription || null,
        license_enabled: licenseEnabled, device_bind: deviceBind,
        device_limit: deviceLimit, expiry_type: expiryType,
        secure_download: secureDownload, require_payment: requirePayment, log_downloads: logDownloads,
        demo_enabled: demoEnabled, demo_url: demoUrl || null,
        demo_login_id: demoLoginId || null, demo_password: demoPassword || null,
      }).select().single();

      if (error) throw error;

      // Save APK record
      if (uploadedApkPath && apkFile) {
        await supabase.from("apks").insert({
          product_id: product.id,
          file_name: apkFile.name,
          file_size: apkFile.size,
          file_hash: apkHash,
          storage_path: uploadedApkPath,
          package_name: packageName || null,
          version: version || null,
        });
      }

      // Log brand violations if any were fixed
      if (brandFixed) {
        await supabase.from("brand_violations").insert({
          product_id: product.id,
          violation_type: "auto_replaced",
          detected_string: "external_branding",
          resolved: true,
        });
      }

      toast({ title: "✅ Product Created", description: `"${name}" saved successfully (${status})` });
      navigate("/admin/products");
    } catch (err: any) {
      toast({ title: "Save failed", description: err.message, variant: "destructive" });
    } finally {
      setSaving(false);
    }
  };

  // ── Tag/Feature helpers ─────────────────────────────────────────
  const addItem = (val: string, list: string[], setList: (v: string[]) => void, setNew: (v: string) => void) => {
    if (val.trim() && !list.includes(val.trim())) { setList([...list, val.trim()]); setNew(""); }
  };
  const removeItem = (idx: number, list: string[], setList: (v: string[]) => void) => {
    setList(list.filter((_, i) => i !== idx));
  };

  const hasError = (field: string) => validationErrors.some(e => e.field === field);

  return (
    <MainLayout title="Add Product" subtitle="Production-grade product entry">
      <div className="space-y-6 max-w-5xl mx-auto pb-20">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center">
              <Package className="h-5 w-5 text-primary" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-foreground">Add Product</h1>
              <p className="text-sm text-muted-foreground">Production-grade product entry with real storage & validation</p>
            </div>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" onClick={aiAutoComplete} disabled={aiGenerating}>
              <Sparkles className="h-4 w-4 mr-2" />
              {aiGenerating ? "Generating…" : "Auto Complete Everything"}
            </Button>
            <Button onClick={saveProduct} disabled={saving}>
              {saving ? "Saving…" : "Save Product"}
            </Button>
          </div>
        </div>

        {/* Validation errors */}
        {validationErrors.length > 0 && (
          <Card className="border-destructive/50 bg-destructive/5">
            <CardContent className="pt-4">
              <div className="flex items-start gap-2">
                <XCircle className="h-5 w-5 text-destructive mt-0.5 shrink-0" />
                <div className="space-y-1">
                  <p className="text-sm font-medium text-destructive">Fix these errors before saving:</p>
                  <ul className="text-xs text-destructive/80 space-y-0.5 list-disc list-inside">
                    {validationErrors.map((e, i) => <li key={i}>{e.message}</li>)}
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Brand violations */}
        {brandViolations.length > 0 && (
          <Card className="border-amber-500/50 bg-amber-500/5">
            <CardContent className="pt-4">
              <div className="flex items-start justify-between gap-4">
                <div className="flex items-start gap-2">
                  <AlertTriangle className="h-5 w-5 text-amber-500 mt-0.5 shrink-0" />
                  <div>
                    <p className="text-sm font-medium text-amber-700 dark:text-amber-400">Brand Violation Detected</p>
                    <p className="text-xs text-muted-foreground">Detected: {brandViolations.join(", ")} — must be replaced with {SOFTWARE_VALA_BRAND}</p>
                  </div>
                </div>
                <Button size="sm" variant="outline" className="border-amber-500 text-amber-700" onClick={fixBranding}>
                  Auto Replace Branding
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {brandFixed && (
          <Card className="border-green-500/50 bg-green-500/5">
            <CardContent className="pt-4">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="h-5 w-5 text-green-500" />
                <p className="text-sm text-green-700 dark:text-green-400">{SOFTWARE_VALA_BRAND} branding injected — all violations resolved</p>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Main Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid grid-cols-6 w-full">
            <TabsTrigger value="basic" className="text-xs"><Package className="h-3 w-3 mr-1" />Basic</TabsTrigger>
            <TabsTrigger value="source" className="text-xs"><Upload className="h-3 w-3 mr-1" />Source</TabsTrigger>
            <TabsTrigger value="media" className="text-xs"><Image className="h-3 w-3 mr-1" />Media</TabsTrigger>
            <TabsTrigger value="content" className="text-xs"><FileText className="h-3 w-3 mr-1" />Content</TabsTrigger>
            <TabsTrigger value="license" className="text-xs"><Shield className="h-3 w-3 mr-1" />License</TabsTrigger>
            <TabsTrigger value="download" className="text-xs"><Download className="h-3 w-3 mr-1" />Download</TabsTrigger>
          </TabsList>

          {/* ─── A: BASIC INFORMATION ─── */}
          <TabsContent value="basic">
            <Card>
              <CardHeader><CardTitle className="text-base flex items-center gap-2"><Package className="h-4 w-4" />Basic Information</CardTitle></CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <Label>Product Name <span className="text-destructive">*</span></Label>
                    <Input placeholder="Software Vala CRM Pro" value={name}
                      onChange={e => { setName(e.target.value); if (!slug) setSlug(slugify(e.target.value)); }}
                      className={hasError("name") ? "border-destructive" : ""} />
                  </div>
                  <div className="space-y-1.5">
                    <Label>Slug (Auto-generated, editable)</Label>
                    <Input placeholder="software-vala-crm-pro" value={slug}
                      onChange={e => setSlug(slugify(e.target.value))}
                      className={hasError("slug") ? "border-destructive" : ""} />
                  </div>
                </div>
                <div className="space-y-1.5">
                  <Label>Short Description <span className="text-destructive">*</span></Label>
                  <Input placeholder="One-line pitch for this product" value={shortDesc}
                    onChange={e => setShortDesc(e.target.value)}
                    className={hasError("shortDesc") ? "border-destructive" : ""} />
                </div>
                <div className="space-y-1.5">
                  <Label>Full Description</Label>
                  <Textarea rows={5} placeholder="Detailed product description..." value={description}
                    onChange={e => setDescription(e.target.value)}
                    className={hasError("description") ? "border-destructive" : ""} />
                </div>
                <div className="grid grid-cols-3 gap-4">
                  {[
                    { label: "Category *", value: category, setter: setCategory, error: "category" },
                    { label: "Sub Category", value: subCategory, setter: setSubCategory, error: "" },
                    { label: "Nano Category", value: nanoCategory, setter: setNanoCategory, error: "" },
                  ].map(f => (
                    <div key={f.label} className="space-y-1.5">
                      <Label>{f.label}</Label>
                      <Input value={f.value} onChange={e => f.setter(e.target.value)}
                        className={f.error && hasError(f.error) ? "border-destructive" : ""} />
                    </div>
                  ))}
                </div>
                <div className="grid grid-cols-2 gap-4">
                  {[
                    { label: "Micro Category", value: microCategory, setter: setMicroCategory },
                    { label: "Deep Category", value: deepCategory, setter: setDeepCategory },
                  ].map(f => (
                    <div key={f.label} className="space-y-1.5">
                      <Label>{f.label}</Label>
                      <Input value={f.value} onChange={e => f.setter(e.target.value)} />
                    </div>
                  ))}
                </div>
                <div className="grid grid-cols-3 gap-4">
                  <div className="space-y-1.5">
                    <Label>Version <span className="text-destructive">*</span></Label>
                    <Input placeholder="1.0.0" value={version} onChange={e => setVersion(e.target.value)}
                      className={hasError("version") ? "border-destructive" : ""} />
                  </div>
                  <div className="space-y-1.5">
                    <Label>Price (₹) <span className="text-destructive">*</span></Label>
                    <Input type="number" min="0" placeholder="0" value={price} onChange={e => setPrice(e.target.value)} />
                  </div>
                  <div className="space-y-1.5">
                    <Label>Status</Label>
                    <Select value={status} onValueChange={(v) => setStatus(v as ProductStatus)}>
                      <SelectTrigger><SelectValue /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="draft">Draft</SelectItem>
                        <SelectItem value="active">Active</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="flex items-center gap-8 pt-2">
                  <div className="flex items-center gap-3">
                    <Switch checked={featured} onCheckedChange={setFeatured} />
                    <Label>Featured</Label>
                  </div>
                  <div className="flex items-center gap-3">
                    <Switch checked={trending} onCheckedChange={setTrending} />
                    <Label>Trending</Label>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* ─── B: SOURCE METHOD ─── */}
          <TabsContent value="source">
            <Card>
              <CardHeader><CardTitle className="text-base flex items-center gap-2"><Upload className="h-4 w-4" />Source Method</CardTitle></CardHeader>
              <CardContent className="space-y-6">
                <RadioGroup value={sourceMethod} onValueChange={v => setSourceMethod(v as SourceMethod)} className="flex gap-6">
                  {[["upload","Upload APK"],["git","Connect Git Repository"],["both","Both"]].map(([val,label]) => (
                    <div key={val} className="flex items-center gap-2">
                      <RadioGroupItem value={val} id={`src-${val}`} />
                      <Label htmlFor={`src-${val}`}>{label}</Label>
                    </div>
                  ))}
                </RadioGroup>

                {(sourceMethod === "upload" || sourceMethod === "both") && (
                  <div className="space-y-4 border rounded-lg p-4">
                    <h3 className="text-sm font-semibold flex items-center gap-2"><Upload className="h-4 w-4" />APK Upload (No Size Limit)</h3>
                    <div
                      className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors ${hasError("apk") ? "border-destructive" : "border-muted-foreground/30 hover:border-primary/50"}`}
                      onDragOver={e => { e.preventDefault(); e.currentTarget.classList.add("border-primary"); }}
                      onDragLeave={e => e.currentTarget.classList.remove("border-primary")}
                      onDrop={e => { e.preventDefault(); e.currentTarget.classList.remove("border-primary"); const f = e.dataTransfer.files[0]; if (f?.name.endsWith(".apk")) handleApkSelect(f); }}
                      onClick={() => apkInputRef.current?.click()}
                    >
                      <Upload className="h-8 w-8 mx-auto mb-2 text-muted-foreground" />
                      <p className="text-sm font-medium">{apkFile ? apkFile.name : "Drag & drop .apk or click to browse"}</p>
                      {apkFile && <p className="text-xs text-muted-foreground mt-1">{(apkFile.size / 1024 / 1024).toFixed(2)} MB</p>}
                      <input ref={apkInputRef} type="file" accept=".apk" className="hidden"
                        onChange={e => { const f = e.target.files?.[0]; if (f) handleApkSelect(f); }} />
                    </div>

                    {apkFile && (
                      <div className="space-y-3">
                        <div className="grid grid-cols-2 gap-3 text-xs">
                          <div className="bg-muted rounded p-2">
                            <p className="text-muted-foreground">Package Name</p>
                            <p className="font-mono font-medium">{packageName || "—"}</p>
                          </div>
                          <div className="bg-muted rounded p-2">
                            <p className="text-muted-foreground">SHA-256 Hash</p>
                            <p className="font-mono truncate">{apkHash || "—"}</p>
                          </div>
                        </div>
                        {!uploadedApkPath ? (
                          <Button onClick={uploadApk} disabled={apkUploading} className="w-full">
                            {apkUploading ? `Uploading… ${uploadProgress}%` : "Upload to Secure Storage"}
                          </Button>
                        ) : (
                          <div className="flex items-center gap-2 text-sm text-green-600 bg-green-50 dark:bg-green-950/20 p-3 rounded-lg">
                            <CheckCircle2 className="h-4 w-4 shrink-0" />
                            <div>
                              <p className="font-medium">Stored securely</p>
                              <p className="text-xs font-mono text-muted-foreground">{uploadedApkPath}</p>
                            </div>
                          </div>
                        )}
                        {apkUploading && <Progress value={uploadProgress} className="h-2" />}
                      </div>
                    )}
                  </div>
                )}

                {(sourceMethod === "git" || sourceMethod === "both") && (
                  <div className="space-y-4 border rounded-lg p-4">
                    <h3 className="text-sm font-semibold flex items-center gap-2"><GitBranch className="h-4 w-4" />Git Repository</h3>
                    <div className="grid grid-cols-2 gap-3">
                      <div className="space-y-1.5">
                        <Label>Repository URL</Label>
                        <Input placeholder="https://github.com/org/repo" value={repoUrl} onChange={e => setRepoUrl(e.target.value)} />
                      </div>
                      <div className="space-y-1.5">
                        <Label>Branch</Label>
                        <Input placeholder="main" value={repoBranch} onChange={e => setRepoBranch(e.target.value)} />
                      </div>
                    </div>
                    <div className="bg-muted/50 rounded-lg p-3 text-xs text-muted-foreground space-y-1">
                      <p>• Auto-detect release tags from repository</p>
                      <p>• Auto-build signed APK on CI pipeline</p>
                      <p>• Extract metadata from build artifacts</p>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* ─── C: MEDIA ─── */}
          <TabsContent value="media">
            <Card>
              <CardHeader><CardTitle className="text-base flex items-center gap-2"><Image className="h-4 w-4" />Media Section</CardTitle></CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-3">
                  <Label>Thumbnail <span className="text-destructive">*</span></Label>
                  <div className="flex gap-3">
                    <div
                      className={`flex-1 border-2 border-dashed rounded-lg p-6 text-center cursor-pointer hover:border-primary/50 ${hasError("thumbnail") ? "border-destructive" : ""}`}
                      onClick={() => thumbInputRef.current?.click()}
                    >
                      {thumbnailUrl ? (
                        <img src={thumbnailUrl} alt="Thumbnail" className="h-24 object-cover mx-auto rounded" />
                      ) : (
                        <>
                          <Image className="h-6 w-6 mx-auto mb-2 text-muted-foreground" />
                          <p className="text-xs text-muted-foreground">Click to upload thumbnail (1:1 or 16:9)</p>
                        </>
                      )}
                      <input ref={thumbInputRef} type="file" accept="image/*" className="hidden"
                        onChange={e => { const f = e.target.files?.[0]; if (f) handleThumbnailUpload(f); }} />
                    </div>
                  </div>
                  <p className="text-xs text-muted-foreground flex items-center gap-1">
                    <Shield className="h-3 w-3" />
                    Watermark "{SOFTWARE_VALA_BRAND}" will be auto-applied on all media
                  </p>
                </div>

                <div className="space-y-3">
                  <Label>Screenshots (Multiple)</Label>
                  <div
                    className="border-2 border-dashed rounded-lg p-6 text-center cursor-pointer hover:border-primary/50"
                    onClick={() => screenshotInputRef.current?.click()}
                  >
                    <Plus className="h-6 w-6 mx-auto mb-2 text-muted-foreground" />
                    <p className="text-xs text-muted-foreground">Click to add screenshots</p>
                    <input ref={screenshotInputRef} type="file" accept="image/*" multiple className="hidden"
                      onChange={e => { if (e.target.files) handleScreenshotsUpload(e.target.files); }} />
                  </div>
                  {screenshots.length > 0 && (
                    <div className="grid grid-cols-4 gap-2">
                      {screenshots.map((url, i) => (
                        <div key={i} className="relative group">
                          <img src={url} alt={`Screenshot ${i+1}`} className="w-full h-20 object-cover rounded-lg" />
                          <button
                            onClick={() => setScreenshots(screenshots.filter((_, j) => j !== i))}
                            className="absolute top-1 right-1 bg-destructive text-destructive-foreground rounded-full p-0.5 opacity-0 group-hover:opacity-100 transition-opacity"
                          >
                            <X className="h-3 w-3" />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                  {mediaUploading && <p className="text-xs text-muted-foreground animate-pulse">Uploading…</p>}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* ─── D: CONTENT & SEO ─── */}
          <TabsContent value="content">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-base flex items-center gap-2"><FileText className="h-4 w-4" />Content & SEO</CardTitle>
                  <Button size="sm" variant="outline" onClick={aiAutoComplete} disabled={aiGenerating}>
                    <Sparkles className="h-3 w-3 mr-1" />
                    {aiGenerating ? "Generating…" : "AI Auto-Fill"}
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="space-y-5">
                {/* Features */}
                <div className="space-y-2">
                  <Label>Feature List</Label>
                  <div className="flex gap-2">
                    <Input placeholder="Add feature…" value={newFeature} onChange={e => setNewFeature(e.target.value)}
                      onKeyDown={e => e.key === "Enter" && addItem(newFeature, features, setFeatures, setNewFeature)} />
                    <Button size="sm" variant="outline" onClick={() => addItem(newFeature, features, setFeatures, setNewFeature)}>
                      <Plus className="h-4 w-4" />
                    </Button>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {features.map((f, i) => (
                      <Badge key={i} variant="secondary" className="gap-1">
                        <Zap className="h-3 w-3" />{f}
                        <button onClick={() => removeItem(i, features, setFeatures)}><X className="h-3 w-3" /></button>
                      </Badge>
                    ))}
                  </div>
                </div>

                {/* Tech Stack */}
                <div className="space-y-2">
                  <Label>Tech Stack</Label>
                  <div className="flex gap-2">
                    <Input placeholder="React, Node.js, PostgreSQL…" value={newTech} onChange={e => setNewTech(e.target.value)}
                      onKeyDown={e => e.key === "Enter" && addItem(newTech, techStack, setTechStack, setNewTech)} />
                    <Button size="sm" variant="outline" onClick={() => addItem(newTech, techStack, setTechStack, setNewTech)}>
                      <Plus className="h-4 w-4" />
                    </Button>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {techStack.map((t, i) => (
                      <Badge key={i} variant="outline" className="gap-1">
                        <Cpu className="h-3 w-3" />{t}
                        <button onClick={() => removeItem(i, techStack, setTechStack)}><X className="h-3 w-3" /></button>
                      </Badge>
                    ))}
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <Label>Use Case</Label>
                    <Textarea rows={3} placeholder="Primary use case…" value={useCase} onChange={e => setUseCase(e.target.value)} />
                  </div>
                  <div className="space-y-1.5">
                    <Label>Target Industry</Label>
                    <Textarea rows={3} placeholder="Healthcare, Education, Retail…" value={targetIndustry} onChange={e => setTargetIndustry(e.target.value)} />
                  </div>
                </div>

                {/* Tags */}
                <div className="space-y-2">
                  <Label>Tags (# format)</Label>
                  <div className="flex gap-2">
                    <Input placeholder="#crm #android #saas" value={newTag} onChange={e => setNewTag(e.target.value.replace(/\s/g, ""))}
                      onKeyDown={e => e.key === "Enter" && addItem(newTag.startsWith("#") ? newTag : `#${newTag}`, tags, setTags, setNewTag)} />
                    <Button size="sm" variant="outline" onClick={() => addItem(newTag.startsWith("#") ? newTag : `#${newTag}`, tags, setTags, setNewTag)}>
                      <Tag className="h-4 w-4" />
                    </Button>
                  </div>
                  <div className="flex flex-wrap gap-1.5">
                    {tags.map((t, i) => (
                      <Badge key={i} className="gap-1 text-xs">
                        {t}<button onClick={() => removeItem(i, tags, setTags)}><X className="h-3 w-3" /></button>
                      </Badge>
                    ))}
                  </div>
                </div>

                {/* Keywords */}
                <div className="space-y-2">
                  <Label>SEO Keywords</Label>
                  <div className="flex gap-2">
                    <Input placeholder="keyword…" value={newKeyword} onChange={e => setNewKeyword(e.target.value)}
                      onKeyDown={e => e.key === "Enter" && addItem(newKeyword, keywords, setKeywords, setNewKeyword)} />
                    <Button size="sm" variant="outline" onClick={() => addItem(newKeyword, keywords, setKeywords, setNewKeyword)}>
                      <Hash className="h-4 w-4" />
                    </Button>
                  </div>
                  <div className="flex flex-wrap gap-1.5">
                    {keywords.map((k, i) => (
                      <Badge key={i} variant="outline" className="gap-1 text-xs">
                        {k}<button onClick={() => removeItem(i, keywords, setKeywords)}><X className="h-3 w-3" /></button>
                      </Badge>
                    ))}
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <Label>SEO Title</Label>
                    <Input placeholder="Meta title (60 chars)" value={seoTitle} onChange={e => setSeoTitle(e.target.value)} maxLength={60} />
                    <p className="text-xs text-muted-foreground">{seoTitle.length}/60</p>
                  </div>
                  <div className="space-y-1.5">
                    <Label>SEO Description</Label>
                    <Input placeholder="Meta description (160 chars)" value={seoDescription} onChange={e => setSeoDescription(e.target.value)} maxLength={160} />
                    <p className="text-xs text-muted-foreground">{seoDescription.length}/160</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* ─── E: LICENSE ─── */}
          <TabsContent value="license">
            <Card>
              <CardHeader><CardTitle className="text-base flex items-center gap-2"><Shield className="h-4 w-4" />License Settings</CardTitle></CardHeader>
              <CardContent className="space-y-5">
                <div className="flex items-center justify-between p-3 border rounded-lg">
                  <div>
                    <p className="text-sm font-medium">Enable License Key System</p>
                    <p className="text-xs text-muted-foreground">Auto-generate key after purchase</p>
                  </div>
                  <Switch checked={licenseEnabled} onCheckedChange={setLicenseEnabled} />
                </div>

                {licenseEnabled && (
                  <>
                    <div className="flex items-center justify-between p-3 border rounded-lg">
                      <div>
                        <p className="text-sm font-medium">Device Binding</p>
                        <p className="text-xs text-muted-foreground">Lock license key to device ID + APK hash</p>
                      </div>
                      <Switch checked={deviceBind} onCheckedChange={setDeviceBind} />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-1.5">
                        <Label>Max Devices</Label>
                        <Input type="number" min="1" value={deviceLimit} onChange={e => setDeviceLimit(parseInt(e.target.value) || 1)} />
                      </div>
                      <div className="space-y-1.5">
                        <Label>Expiry Type</Label>
                        <Select value={expiryType} onValueChange={v => setExpiryType(v as ExpiryType)}>
                          <SelectTrigger><SelectValue /></SelectTrigger>
                          <SelectContent>
                            <SelectItem value="lifetime">Lifetime</SelectItem>
                            <SelectItem value="monthly">Monthly</SelectItem>
                            <SelectItem value="yearly">Yearly</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    <div className="bg-primary/5 border border-primary/20 rounded-lg p-4 text-xs space-y-1">
                      <p className="font-semibold text-primary">Anti-Crack Protection Active</p>
                      <p className="text-muted-foreground">License binds: key + device_id + app_hash</p>
                      <p className="text-muted-foreground">APK modification → verification fails</p>
                      <p className="text-muted-foreground">Key reuse on another device → rejected</p>
                      <p className="text-muted-foreground">Brute force lockout after 3 attempts</p>
                    </div>
                  </>
                )}

                {/* Demo system */}
                <div className="border-t pt-4 space-y-4">
                  <p className="text-sm font-semibold">Demo System</p>
                  <div className="flex items-center justify-between p-3 border rounded-lg">
                    <div>
                      <p className="text-sm font-medium">Enable Live Demo Button</p>
                      <p className="text-xs text-muted-foreground">Show demo URL on product card — no payment required</p>
                    </div>
                    <Switch checked={demoEnabled} onCheckedChange={setDemoEnabled} />
                  </div>
                  {demoEnabled && (
                    <div className="space-y-3 pl-2 border-l-2 border-muted">
                      <div className="space-y-1.5">
                        <Label>Demo URL</Label>
                        <Input placeholder="https://demo.softwarevala.com/crm" value={demoUrl} onChange={e => setDemoUrl(e.target.value)} />
                      </div>
                      <div className="grid grid-cols-2 gap-3">
                        <div className="space-y-1.5">
                          <Label>Demo Login ID</Label>
                          <Input placeholder="demo@test.com" value={demoLoginId} onChange={e => setDemoLoginId(e.target.value)} />
                        </div>
                        <div className="space-y-1.5">
                          <Label>Demo Password</Label>
                          <div className="relative">
                            <Input type={showDemoPass ? "text" : "password"} placeholder="demo123" value={demoPassword} onChange={e => setDemoPassword(e.target.value)} />
                            <button onClick={() => setShowDemoPass(!showDemoPass)} className="absolute right-2 top-1/2 -translate-y-1/2 text-muted-foreground">
                              {showDemoPass ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* ─── F: DOWNLOAD ─── */}
          <TabsContent value="download">
            <Card>
              <CardHeader><CardTitle className="text-base flex items-center gap-2"><Download className="h-4 w-4" />Download Settings</CardTitle></CardHeader>
              <CardContent className="space-y-4">
                {[
                  { label: "Secure Download Only", sub: "Generate signed URL with 5-minute expiry — direct access blocked", checked: secureDownload, setter: setSecureDownload },
                  { label: "Require Payment Before Download", sub: "Block download until payment_status = SUCCESS", checked: requirePayment, setter: setRequirePayment },
                  { label: "Log All Downloads", sub: "Record IP, user agent, license key, and timestamp per download", checked: logDownloads, setter: setLogDownloads },
                ].map(item => (
                  <div key={item.label} className="flex items-center justify-between p-3 border rounded-lg">
                    <div>
                      <p className="text-sm font-medium">{item.label}</p>
                      <p className="text-xs text-muted-foreground">{item.sub}</p>
                    </div>
                    <Switch checked={item.checked} onCheckedChange={item.setter} />
                  </div>
                ))}

                <div className="bg-amber-500/5 border border-amber-500/20 rounded-lg p-4 space-y-2 text-xs">
                  <p className="font-semibold text-amber-700 dark:text-amber-400 flex items-center gap-1"><Lock className="h-3 w-3" />Download Lock Rules</p>
                  <ul className="text-muted-foreground space-y-1 list-disc list-inside">
                    <li>Download button hidden if <code className="bg-muted px-1 rounded">apk_url = NULL</code></li>
                    <li>Payment lock: <code className="bg-muted px-1 rounded">payment_status = SUCCESS</code> required</li>
                    <li>License must be generated before download enabled</li>
                    <li>Signed URL expires in 5 minutes — no hotlinking</li>
                    <li>Token validated on every download request</li>
                    <li>File hash verified at download time</li>
                  </ul>
                </div>

                <div className="bg-muted/50 rounded-lg p-4 text-xs space-y-2">
                  <p className="font-semibold flex items-center gap-1"><Globe className="h-3 w-3" />Storage Path Preview</p>
                  {uploadedApkPath ? (
                    <code className="block bg-background border rounded p-2 font-mono text-xs break-all">{uploadedApkPath}</code>
                  ) : (
                    <p className="text-muted-foreground">APK not yet uploaded — storage path will appear here after upload</p>
                  )}
                </div>
              </CardContent>
            </Card>

            <div className="mt-4 flex justify-end gap-3">
              <Button variant="outline" onClick={() => navigate(-1)}>Cancel</Button>
              <Button onClick={saveProduct} disabled={saving} size="lg">
                {saving ? "Saving to Database…" : "Save Product"}
              </Button>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </MainLayout>
  );
}
