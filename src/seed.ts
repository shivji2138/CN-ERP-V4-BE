import bcrypt from "bcryptjs";
import { connectDatabase } from "./config/database.js";
import { connectRedis, redis } from "./config/redis.js";
import { PERMISSIONS, Role } from "./modules/role/role.model.js";
import { User } from "./modules/user/user.model.js";

async function seed() {
  await connectDatabase();
  await connectRedis();
  const allPermissions = [...PERMISSIONS];
  const userReadPermissions = allPermissions.filter(
    (permission) =>
      permission.endsWith(":read") &&
      !permission.startsWith("role:") &&
      !permission.startsWith("payroll:")
  );
  const roles = [
    { name: "Super Admin", slug: "super_admin", permissions: allPermissions },
    { name: "Admin", slug: "admin", permissions: allPermissions },
    { name: "HR", slug: "hr", permissions: allPermissions.filter((permission) => !permission.startsWith("payroll:delete")) },
    { name: "Manager", slug: "manager", permissions: allPermissions.filter((permission) => !permission.startsWith("role:") && !permission.startsWith("payroll:")) },
    { name: "Employee", slug: "employee", permissions: [...new Set([...userReadPermissions, "dashboard:read", "task:update", "leave:create", "ticket:create", "notification:read"])] },
    { name: "Intern", slug: "intern", permissions: [...new Set([...userReadPermissions, "dashboard:read", "task:update", "leave:create", "ticket:create", "notification:read"])] }
  ];
  for (const role of roles) {
    await Role.updateOne({ slug: role.slug }, role, { upsert: true });
  }
  const superRole = await Role.findOne({ slug: "super_admin" });
  await User.updateOne(
    { email: "superadmin@cybernaut.com" },
    {
      firstName: "Cybernaut",
      lastName: "Super Admin",
      email: "superadmin@cybernaut.com",
      passwordHash: await bcrypt.hash("ChangeMe123!", 12),
      panel: "super_admin",
      role: "super_admin",
      roleId: superRole?._id,
      status: "active"
    },
    { upsert: true }
  );
  await redis.quit();
  console.log("Seed completed. Login: superadmin@cybernaut.com / ChangeMe123!");
  process.exit(0);
}

seed().catch((error) => {
  console.error(error);
  process.exit(1);
});
