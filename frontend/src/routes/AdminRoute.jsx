import { Route } from "react-router-dom";
import AdminLayout from "../admin/AdminLayout";

import Dashboard from "../admin/pages/Dashboard";
import AdminProduct from "../admin/pages/AdminProduct";
import ProductForm from "../admin/pages/ProductForm";
import Users from "../admin/pages/Users";
import Orders from "../admin/pages/AdminOrders";

export const AdminRoutes = (
  <Route path="/admin" element={<AdminLayout />}>
    <Route index element={<Dashboard />} />

 
    <Route path="products" element={<AdminProduct />} />
    <Route path="products/new" element={<ProductForm />} />
    <Route path="products/:id" element={<ProductForm />} />

  
    <Route path="users" element={<Users />} />
    <Route path="orders" element={<Orders />} />
  </Route>
);
