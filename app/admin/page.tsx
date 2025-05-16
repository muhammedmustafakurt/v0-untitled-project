import { Header } from "@/components/header"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { AdminUsersList } from "@/components/admin/users-list"
import { AdminNumbersList } from "@/components/admin/numbers-list"
import { Suspense } from "react"
import { Loader2 } from "lucide-react"

export default function AdminPage() {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />

      <div className="container mx-auto px-4 py-8 flex-1">
        <h1 className="text-3xl font-bold mb-6">Admin Paneli</h1>

        <Tabs defaultValue="users" className="w-full">
          <TabsList className="mb-6">
            <TabsTrigger value="users">Kullanıcılar</TabsTrigger>
            <TabsTrigger value="numbers">Kiralanan Numaralar</TabsTrigger>
          </TabsList>

          <TabsContent value="users">
            <Suspense fallback={<LoadingState />}>
              <AdminUsersList />
            </Suspense>
          </TabsContent>

          <TabsContent value="numbers">
            <Suspense fallback={<LoadingState />}>
              <AdminNumbersList />
            </Suspense>
          </TabsContent>
        </Tabs>
      </div>

      <footer className="bg-gray-800 text-white py-4">
        <div className="container mx-auto px-4 text-center">
          <p className="text-sm text-gray-400">© 2025 Yemeksepeti Doğrulama. Tüm hakları saklıdır.</p>
        </div>
      </footer>
    </div>
  )
}

function LoadingState() {
  return (
    <div className="flex justify-center items-center p-12">
      <Loader2 className="h-8 w-8 animate-spin text-gray-400" />
    </div>
  )
}
