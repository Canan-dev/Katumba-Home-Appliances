"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import {
  User as FirebaseUser,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signOut,
} from "firebase/auth";
import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDocs,
  orderBy,
  query,
  updateDoc,
} from "firebase/firestore";
import {
  ArrowLeft,
  Lock,
  LogOut,
  Plus,
  Pencil,
  Trash2,
  Upload,
  Loader2,
  CheckCircle2,
  AlertCircle,
  Database,
} from "lucide-react";

import { auth, db, isFirebaseConfigured } from "@/lib/firebase";
import { compressImage } from "@/lib/compressImage";
import { uploadToCloudinary } from "@/lib/cloudinary";
import { PRODUCTS_COLLECTION } from "@/lib/products";
import { formatUGX } from "@/lib/format";
import { SAMPLE_PRODUCTS } from "@/data/sampleProducts";
import { PRODUCT_CATEGORIES, Product, ProductCategory } from "@/types/product";

interface ProductFormState {
  name: string;
  category: ProductCategory;
  priceUGX: string;
  material: string;
  dimensions: string;
  description: string;
  imageUrl: string;
}

const EMPTY_FORM: ProductFormState = {
  name: "",
  category: "Living Room",
  priceUGX: "",
  material: "",
  dimensions: "",
  description: "",
  imageUrl: "",
};

export default function AdminPage() {
  const [user, setUser] = useState<FirebaseUser | null>(null);
  const [authLoading, setAuthLoading] = useState(true);

  // Login form
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loginError, setLoginError] = useState("");
  const [loggingIn, setLoggingIn] = useState(false);

  // Products state
  const [products, setProducts] = useState<Product[]>([]);
  const [loadingProducts, setLoadingProducts] = useState(false);

  // Product editor state
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState<ProductFormState>(EMPTY_FORM);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string>("");
  const [compressing, setCompressing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [seeding, setSeeding] = useState(false);
  const [feedback, setFeedback] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);

  useEffect(() => {
    if (!isFirebaseConfigured || !auth) {
      setAuthLoading(false);
      return;
    }
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setAuthLoading(false);
    });
    return () => unsubscribe();
  }, []);

  const loadFirestoreProducts = async () => {
    if (!db) return;
    setLoadingProducts(true);
    try {
      const q = query(
        collection(db, PRODUCTS_COLLECTION),
        orderBy("createdAt", "desc")
      );
      const snap = await getDocs(q);
      const list: Product[] = snap.docs.map((d) => {
        const data = d.data();
        return {
          id: d.id,
          name: String(data.name || ""),
          category: (data.category as ProductCategory) || "Living Room",
          priceUGX: Number(data.priceUGX || 0),
          imageUrl: String(data.imageUrl || ""),
          material: String(data.material || ""),
          dimensions: String(data.dimensions || ""),
          description: String(data.description || ""),
          createdAt: Number(data.createdAt || Date.now()),
        };
      });
      setProducts(list);
    } catch (err) {
      console.error("Failed to fetch products:", err);
      setFeedback({
        type: "error",
        text: "Could not load products from Firestore. Check your Security Rules.",
      });
    } finally {
      setLoadingProducts(false);
    }
  };

  useEffect(() => {
    if (user) loadFirestoreProducts();
  }, [user]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!auth) return;
    setLoginError("");
    setLoggingIn(true);
    try {
      await signInWithEmailAndPassword(auth, email.trim(), password);
      setPassword("");
    } catch (err: unknown) {
      const message =
        err instanceof Error ? err.message : "Invalid email or password.";
      setLoginError(
        message.includes("auth/invalid-credential") ||
          message.includes("auth/wrong-password") ||
          message.includes("auth/user-not-found")
          ? "Invalid email or password. Please check your Firebase Auth credentials."
          : message
      );
    } finally {
      setLoggingIn(false);
    }
  };

  const handleLogout = async () => {
    if (!auth) return;
    await signOut(auth);
    setProducts([]);
    resetForm();
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Show preview immediately
    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === "string") setImagePreview(reader.result);
    };
    reader.readAsDataURL(file);

    // Compress in background for fast upload
    setCompressing(true);
    try {
      const compressed = await compressImage(file);
      setImageFile(compressed);
    } catch {
      setImageFile(file);
    } finally {
      setCompressing(false);
    }
  };

  const resetForm = () => {
    setEditingId(null);
    setForm(EMPTY_FORM);
    setImageFile(null);
    setImagePreview("");
  };

  const startEdit = (product: Product) => {
    setEditingId(product.id);
    setForm({
      name: product.name,
      category: product.category,
      priceUGX: String(product.priceUGX),
      material: product.material,
      dimensions: product.dimensions,
      description: product.description,
      imageUrl: product.imageUrl,
    });
    setImageFile(null);
    setImagePreview(product.imageUrl);
    setFeedback(null);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleSaveProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!db || !user) return;
    setFeedback(null);

    const parsedPrice = Number(form.priceUGX.replace(/[^\d]/g, ""));
    if (!form.name.trim() || !parsedPrice || parsedPrice <= 0) {
      setFeedback({ type: "error", text: "Please enter a valid product name and price in UGX." });
      return;
    }
    if (!imageFile && !form.imageUrl.trim()) {
      setFeedback({ type: "error", text: "Please upload a product photo or provide an image URL." });
      return;
    }

    setSaving(true);
    try {
      let finalImageUrl = form.imageUrl.trim();

      // Upload to Cloudinary if a new file was selected
      if (imageFile) {
        finalImageUrl = await uploadToCloudinary(imageFile);
      }

      const payload = {
        name: form.name.trim(),
        category: form.category,
        priceUGX: parsedPrice,
        material: form.material.trim() || "Solid Ugandan Hardwood",
        dimensions: form.dimensions.trim() || "Standard Showroom Size",
        description: form.description.trim(),
        imageUrl: finalImageUrl,
        updatedAt: Date.now(),
      };

      if (editingId) {
        await updateDoc(doc(db, PRODUCTS_COLLECTION, editingId), payload);
        setFeedback({ type: "success", text: `"${payload.name}" updated successfully.` });
      } else {
        await addDoc(collection(db, PRODUCTS_COLLECTION), {
          ...payload,
          rating: 4.9,
          reviewCount: 1,
          createdAt: Date.now(),
        });
        setFeedback({ type: "success", text: `"${payload.name}" added to the catalog.` });
      }

      resetForm();
      await loadFirestoreProducts();
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Failed to save product.";
      setFeedback({ type: "error", text: msg });
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (product: Product) => {
    if (!db) return;
    if (!window.confirm(`Delete "${product.name}"? This cannot be undone.`)) return;
    try {
      await deleteDoc(doc(db, PRODUCTS_COLLECTION, product.id));
      setFeedback({ type: "success", text: `"${product.name}" deleted.` });
      if (editingId === product.id) resetForm();
      await loadFirestoreProducts();
    } catch (err: unknown) {
      setFeedback({ type: "error", text: err instanceof Error ? err.message : "Failed to delete." });
    }
  };

  const handleSeedSamples = async () => {
    if (!db || !user) return;
    setSeeding(true);
    setFeedback(null);
    try {
      for (let i = 0; i < SAMPLE_PRODUCTS.length; i++) {
        const item = SAMPLE_PRODUCTS[i];
        await addDoc(collection(db, PRODUCTS_COLLECTION), {
          name: item.name,
          category: item.category,
          priceUGX: item.priceUGX,
          imageUrl: item.imageUrl,
          material: item.material,
          dimensions: item.dimensions,
          description: item.description,
          swatches: item.swatches || [],
          rating: item.rating ?? 4.8,
          reviewCount: item.reviewCount ?? 15,
          featured: Boolean(item.featured),
          createdAt: Date.now() - i * 1000,
        });
      }
      setFeedback({ type: "success", text: `Imported ${SAMPLE_PRODUCTS.length} sample products into Firestore!` });
      await loadFirestoreProducts();
    } catch (err: unknown) {
      setFeedback({ type: "error", text: err instanceof Error ? err.message : "Failed to seed." });
    } finally {
      setSeeding(false);
    }
  };

  if (!isFirebaseConfigured) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#F7F4EF] p-6">
        <div className="max-w-md rounded-3xl border border-[#E4DDD3] bg-white p-8 text-center shadow-sm">
          <AlertCircle className="mx-auto h-10 w-10 text-[#9B3B2E]" />
          <h1 className="mt-4 text-xl font-bold text-[#2C221E]">Firebase Not Configured</h1>
          <p className="mt-2 text-sm text-[#6E6058]">
            Please add your Firebase keys to <code>.env.local</code> as described in <code>README.md</code>, then restart the server.
          </p>
          <Link href="/" className="mt-6 inline-flex items-center gap-2 rounded-full bg-[#5C4332] px-6 py-2.5 text-xs font-semibold text-white">
            <ArrowLeft className="h-4 w-4" />
            <span>Back to Storefront</span>
          </Link>
        </div>
      </div>
    );
  }

  if (authLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#F7F4EF]">
        <Loader2 className="h-7 w-7 animate-spin text-[#5C4332]" />
      </div>
    );
  }

  if (!user) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center bg-[#F7F4EF] px-4 py-12">
        <div className="w-full max-w-md rounded-3xl border border-[#E4DDD3] bg-white p-8 shadow-sm sm:p-10">
          <div className="mb-6 flex items-center justify-between">
            <Link href="/" className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#6E6058] hover:text-[#2C221E]">
              <ArrowLeft className="h-3.5 w-3.5" />
              <span>Storefront</span>
            </Link>
            <span className="flex h-9 w-9 items-center justify-center rounded-full bg-[#EFE9E0] text-[#5C4332]">
              <Lock className="h-4 w-4" />
            </span>
          </div>

          <h1 className="text-2xl font-extrabold tracking-tight text-[#2C221E]">Owner Admin Login</h1>
          <p className="mt-1.5 text-xs leading-relaxed text-[#6E6058]">
            Sign in with your Firebase Authentication owner account to manage Katumba Home Appliances products and photos.
          </p>

          {loginError && (
            <div className="mt-4 flex items-start gap-2 rounded-2xl border border-[#E5B8B2] bg-[#FDF3F2] p-3.5 text-xs text-[#8C2D22]">
              <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
              <span>{loginError}</span>
            </div>
          )}

          <form onSubmit={handleLogin} className="mt-6 space-y-4">
            <div>
              <label className="mb-1.5 block text-xs font-bold tracking-[0.06em] text-[#2C221E] uppercase">Owner Email</label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="owner@katumbahome.ug"
                className="w-full rounded-xl border border-[#D8CFC3] bg-[#F7F4EF] px-4 py-3 text-sm text-[#2C221E] focus:border-[#5C4332] focus:bg-white focus:outline-none"
              />
            </div>
            <div>
              <label className="mb-1.5 block text-xs font-bold tracking-[0.06em] text-[#2C221E] uppercase">Password</label>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full rounded-xl border border-[#D8CFC3] bg-[#F7F4EF] px-4 py-3 text-sm text-[#2C221E] focus:border-[#5C4332] focus:bg-white focus:outline-none"
              />
            </div>
            <button
              type="submit"
              disabled={loggingIn}
              className="flex w-full items-center justify-center gap-2 rounded-full bg-[#5C4332] px-6 py-3.5 text-sm font-bold text-white transition-colors hover:bg-[#483326] disabled:opacity-60"
            >
              {loggingIn && <Loader2 className="h-4 w-4 animate-spin" />}
              <span>{loggingIn ? "Signing In..." : "Sign In"}</span>
            </button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F7F4EF] text-[#2C221E]">
      <header className="sticky top-0 z-30 border-b border-[#E4DDD3] bg-[#F7F4EF]/95 backdrop-blur-md">
        <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-3 px-4 py-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-4">
            <Link href="/" className="inline-flex items-center gap-1.5 rounded-full border border-[#D8CFC3] bg-white px-4 py-2 text-xs font-semibold text-[#2C221E] hover:bg-[#EFE9E0]">
              <ArrowLeft className="h-3.5 w-3.5" />
              <span>View Storefront</span>
            </Link>
            <div>
              <h1 className="text-base font-extrabold tracking-tight sm:text-lg">Katumba Admin Dashboard</h1>
              <p className="text-[11px] text-[#6E6058]">Signed in as {user.email}</p>
            </div>
          </div>
          <div className="flex items-center gap-2.5">
            {products.length === 0 && !loadingProducts && (
              <button
                type="button"
                onClick={handleSeedSamples}
                disabled={seeding}
                className="inline-flex items-center gap-1.5 rounded-full border border-[#5C4332] bg-white px-4 py-2 text-xs font-semibold text-[#5C4332] hover:bg-[#EFE9E0] disabled:opacity-60"
              >
                {seeding ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Database className="h-3.5 w-3.5" />}
                <span>Import Sample Catalog</span>
              </button>
            )}
            <button
              type="button"
              onClick={handleLogout}
              className="inline-flex items-center gap-1.5 rounded-full bg-[#2C221E] px-4 py-2 text-xs font-semibold text-white hover:bg-[#463832]"
            >
              <LogOut className="h-3.5 w-3.5" />
              <span>Sign Out</span>
            </button>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        {feedback && (
          <div className={`mb-6 flex items-center gap-2.5 rounded-2xl border p-4 text-sm ${feedback.type === "success" ? "border-[#B9D6BE] bg-[#F1F8F2] text-[#2F5D37]" : "border-[#E5B8B2] bg-[#FDF3F2] text-[#8C2D22]"}`}>
            {feedback.type === "success" ? <CheckCircle2 className="h-4 w-4 shrink-0" /> : <AlertCircle className="h-4 w-4 shrink-0" />}
            <span>{feedback.text}</span>
          </div>
        )}

        <div className="grid grid-cols-1 gap-8 lg:grid-cols-12">
          {/* Add / Edit Form */}
          <section className="lg:col-span-5">
            <div className="rounded-3xl border border-[#E4DDD3] bg-white p-6 shadow-sm sm:p-7">
              <div className="mb-5 flex items-center justify-between">
                <h2 className="text-lg font-extrabold text-[#2C221E]">{editingId ? "Edit Product" : "Add New Product"}</h2>
                {editingId && (
                  <button type="button" onClick={resetForm} className="text-xs font-semibold text-[#6E6058] hover:underline">
                    Cancel Edit
                  </button>
                )}
              </div>

              <form onSubmit={handleSaveProduct} className="space-y-4">
                <div>
                  <label className="mb-1 block text-xs font-bold tracking-[0.06em] text-[#2C221E] uppercase">Product Name *</label>
                  <input type="text" required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="e.g. Nakasero Solid Mvule Dining Table" className="w-full rounded-xl border border-[#D8CFC3] bg-[#F7F4EF] px-4 py-2.5 text-sm focus:border-[#5C4332] focus:bg-white focus:outline-none" />
                </div>

                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <div>
                    <label className="mb-1 block text-xs font-bold tracking-[0.06em] text-[#2C221E] uppercase">Category *</label>
                    <select value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value as ProductCategory })} className="w-full rounded-xl border border-[#D8CFC3] bg-[#F7F4EF] px-3.5 py-2.5 text-sm focus:border-[#5C4332] focus:bg-white focus:outline-none">
                      {PRODUCT_CATEGORIES.map((cat) => <option key={cat} value={cat}>{cat}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="mb-1 block text-xs font-bold tracking-[0.06em] text-[#2C221E] uppercase">Price (UGX) *</label>
                    <input type="number" min="1000" step="1000" required value={form.priceUGX} onChange={(e) => setForm({ ...form, priceUGX: e.target.value })} placeholder="1850000" className="w-full rounded-xl border border-[#D8CFC3] bg-[#F7F4EF] px-4 py-2.5 text-sm focus:border-[#5C4332] focus:bg-white focus:outline-none" />
                  </div>
                </div>

                <div>
                  <label className="mb-1 block text-xs font-bold tracking-[0.06em] text-[#2C221E] uppercase">Wood / Material Details</label>
                  <input type="text" value={form.material} onChange={(e) => setForm({ ...form, material: e.target.value })} placeholder="e.g. Kiln-dried Mvule & oat linen" className="w-full rounded-xl border border-[#D8CFC3] bg-[#F7F4EF] px-4 py-2.5 text-sm focus:border-[#5C4332] focus:bg-white focus:outline-none" />
                </div>

                <div>
                  <label className="mb-1 block text-xs font-bold tracking-[0.06em] text-[#2C221E] uppercase">Dimensions</label>
                  <input type="text" value={form.dimensions} onChange={(e) => setForm({ ...form, dimensions: e.target.value })} placeholder="e.g. 200 cm L × 100 cm W × 76 cm H" className="w-full rounded-xl border border-[#D8CFC3] bg-[#F7F4EF] px-4 py-2.5 text-sm focus:border-[#5C4332] focus:bg-white focus:outline-none" />
                </div>

                <div>
                  <label className="mb-1 block text-xs font-bold tracking-[0.06em] text-[#2C221E] uppercase">Description *</label>
                  <textarea rows={3} required value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} placeholder="Describe craftsmanship, warranty, or key features..." className="w-full rounded-xl border border-[#D8CFC3] bg-[#F7F4EF] px-4 py-2.5 text-sm focus:border-[#5C4332] focus:bg-white focus:outline-none" />
                </div>

                {/* Photo Upload via Cloudinary */}
                <div>
                  <label className="mb-1.5 block text-xs font-bold tracking-[0.06em] text-[#2C221E] uppercase">Product Photo *</label>
                  <label className="flex cursor-pointer flex-col items-center justify-center rounded-2xl border-2 border-dashed border-[#D8CFC3] bg-[#F7F4EF] p-4 text-center transition hover:border-[#5C4332]">
                    <Upload className="h-5 w-5 text-[#5C4332]" />
                    <span className="mt-1.5 text-xs font-semibold text-[#2C221E]">
                      {compressing ? "Compressing image…" : imageFile ? `✓ Ready — ${(imageFile.size / 1024).toFixed(0)} KB` : "Click to upload photo (via Cloudinary)"}
                    </span>
                    <span className="text-[11px] text-[#6E6058]">
                      {compressing ? "Reducing file size for fast upload…" : "JPG, PNG or WebP — auto-compressed before upload"}
                    </span>
                    <input type="file" accept="image/*" onChange={handleFileChange} className="hidden" />
                  </label>

                  {(imagePreview || form.imageUrl) && (
                    <div className="mt-3 aspect-[4/3] w-full overflow-hidden rounded-xl border border-[#E4DDD3] bg-[#EFE9E0]">
                      <img src={imagePreview || form.imageUrl} alt="Product preview" className="h-full w-full object-cover object-center" />
                    </div>
                  )}

                  <input
                    type="url"
                    value={form.imageUrl}
                    onChange={(e) => { setForm({ ...form, imageUrl: e.target.value }); if (!imageFile) setImagePreview(e.target.value); }}
                    placeholder="Or paste an existing image URL"
                    className="mt-2.5 w-full rounded-xl border border-[#D8CFC3] bg-[#F7F4EF] px-3.5 py-2 text-xs focus:border-[#5C4332] focus:bg-white focus:outline-none"
                  />
                </div>

                <button
                  type="submit"
                  disabled={saving || compressing}
                  className="flex w-full items-center justify-center gap-2 rounded-full bg-[#5C4332] px-6 py-3.5 text-sm font-bold text-white transition-colors hover:bg-[#483326] disabled:opacity-60"
                >
                  {(saving || compressing) && <Loader2 className="h-4 w-4 animate-spin" />}
                  <span>{compressing ? "Compressing…" : saving ? "Uploading & Saving…" : editingId ? "Save Product Changes" : "Publish Product"}</span>
                </button>
              </form>
            </div>
          </section>

          {/* Existing Products Inventory */}
          <section className="lg:col-span-7">
            <div className="rounded-3xl border border-[#E4DDD3] bg-white p-6 shadow-sm sm:p-7">
              <div className="mb-5">
                <h2 className="text-lg font-extrabold text-[#2C221E]">Live Firestore Inventory</h2>
                <p className="text-xs text-[#6E6058]">{products.length} item{products.length === 1 ? "" : "s"} in Cloud Firestore</p>
              </div>

              {loadingProducts ? (
                <div className="flex items-center justify-center py-16">
                  <Loader2 className="h-6 w-6 animate-spin text-[#5C4332]" />
                </div>
              ) : products.length === 0 ? (
                <div className="rounded-2xl border border-[#E4DDD3] bg-[#F7F4EF] p-8 text-center">
                  <p className="text-sm font-bold text-[#2C221E]">Your Firestore catalog is currently empty.</p>
                  <p className="mt-1 text-xs text-[#6E6058]">The public storefront displays the curated sample catalog until you add your first product or import the samples.</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {products.map((item) => (
                    <div key={item.id} className="flex flex-col gap-4 rounded-2xl border border-[#E4DDD3] bg-[#F7F4EF]/60 p-3.5 sm:flex-row sm:items-center">
                      <div className="aspect-[4/3] w-full shrink-0 overflow-hidden rounded-xl bg-[#EFE9E0] sm:w-28">
                        <img src={item.imageUrl} alt={item.name} className="h-full w-full object-cover object-center" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <span className="text-[10px] font-bold tracking-[0.1em] text-[#6E6058] uppercase">{item.category}</span>
                        <h3 className="truncate text-sm font-bold text-[#2C221E]">{item.name}</h3>
                        <p className="mt-0.5 text-sm font-extrabold text-[#5C4332]">{formatUGX(item.priceUGX)}</p>
                      </div>
                      <div className="flex items-center gap-2 self-end sm:self-center">
                        <button type="button" onClick={() => startEdit(item)} className="inline-flex items-center gap-1 rounded-full border border-[#D8CFC3] bg-white px-3.5 py-1.5 text-xs font-semibold text-[#2C221E] hover:bg-[#EFE9E0]">
                          <Pencil className="h-3.5 w-3.5" />
                          <span>Edit</span>
                        </button>
                        <button type="button" onClick={() => handleDelete(item)} className="inline-flex items-center gap-1 rounded-full border border-[#E5B8B2] bg-white px-3.5 py-1.5 text-xs font-semibold text-[#8C2D22] hover:bg-[#FDF3F2]">
                          <Trash2 className="h-3.5 w-3.5" />
                          <span>Delete</span>
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </section>
        </div>
      </main>
    </div>
  );
}
