-- CreateTable
CREATE TABLE "users" (
    "id" UUID NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password_hash" TEXT NOT NULL,
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "last_login" TIMESTAMP(3),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "roles" (
    "id" UUID NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "roles_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "permissions" (
    "id" UUID NOT NULL,
    "code" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "module" TEXT NOT NULL,

    CONSTRAINT "permissions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "user_roles" (
    "user_id" UUID NOT NULL,
    "role_id" UUID NOT NULL,

    CONSTRAINT "user_roles_pkey" PRIMARY KEY ("user_id","role_id")
);

-- CreateTable
CREATE TABLE "role_permissions" (
    "role_id" UUID NOT NULL,
    "permission_id" UUID NOT NULL,

    CONSTRAINT "role_permissions_pkey" PRIMARY KEY ("role_id","permission_id")
);

-- CreateTable
CREATE TABLE "pops" (
    "id" UUID NOT NULL,
    "name" TEXT NOT NULL,
    "code" TEXT NOT NULL,
    "address" TEXT,
    "latitude" DECIMAL(10,8),
    "longitude" DECIMAL(11,8),
    "region" TEXT,
    "description" TEXT,
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "pops_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "devices" (
    "id" UUID NOT NULL,
    "name" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "vendor" TEXT,
    "model" TEXT,
    "ip_address" TEXT NOT NULL,
    "management_ip" TEXT,
    "port" INTEGER,
    "serial_number" TEXT,
    "firmware_version" TEXT,
    "status" TEXT NOT NULL DEFAULT 'UNKNOWN',
    "pop_id" UUID,
    "latitude" DECIMAL(10,8),
    "longitude" DECIMAL(11,8),
    "description" TEXT,
    "metadata" JSONB,
    "last_seen" TIMESTAMP(3),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "devices_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "device_credentials" (
    "id" UUID NOT NULL,
    "device_id" UUID NOT NULL,
    "protocol" TEXT NOT NULL,
    "snmp_version" TEXT,
    "snmp_community_enc" TEXT,
    "snmp_username_enc" TEXT,
    "snmp_auth_password_enc" TEXT,
    "snmp_priv_password_enc" TEXT,
    "snmp_auth_protocol" TEXT,
    "snmp_priv_protocol" TEXT,
    "ssh_username_enc" TEXT,
    "ssh_password_enc" TEXT,
    "ssh_port" INTEGER NOT NULL DEFAULT 22,
    "api_username_enc" TEXT,
    "api_password_enc" TEXT,
    "api_port" INTEGER,
    "api_use_ssl" BOOLEAN NOT NULL DEFAULT false,
    "encryption_iv" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "device_credentials_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "device_interfaces" (
    "id" UUID NOT NULL,
    "device_id" UUID NOT NULL,
    "name" TEXT NOT NULL,
    "type" TEXT,
    "status" TEXT,
    "speed" BIGINT,
    "mac_address" TEXT,
    "description" TEXT,
    "if_index" INTEGER,
    "metadata" JSONB,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "device_interfaces_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "olts" (
    "id" UUID NOT NULL,
    "device_id" UUID NOT NULL,
    "olt_type" TEXT,
    "total_pon_ports" INTEGER,
    "total_boards" INTEGER,
    "software_version" TEXT,
    "hardware_version" TEXT,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "olts_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "olt_boards" (
    "id" UUID NOT NULL,
    "olt_id" UUID NOT NULL,
    "slot" INTEGER NOT NULL,
    "board_type" TEXT,
    "status" TEXT,
    "serial_number" TEXT,
    "hardware_version" TEXT,
    "software_version" TEXT,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "olt_boards_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "olt_pon_ports" (
    "id" UUID NOT NULL,
    "olt_id" UUID NOT NULL,
    "slot" INTEGER NOT NULL,
    "port" INTEGER NOT NULL,
    "name" TEXT,
    "status" TEXT,
    "total_onus" INTEGER NOT NULL DEFAULT 0,
    "online_onus" INTEGER NOT NULL DEFAULT 0,
    "pon_type" TEXT,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "olt_pon_ports_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "onus" (
    "id" UUID NOT NULL,
    "olt_id" UUID NOT NULL,
    "pon_port_id" UUID NOT NULL,
    "onu_id" INTEGER NOT NULL,
    "serial_number" TEXT,
    "loid" TEXT,
    "vendor" TEXT,
    "model" TEXT,
    "firmware" TEXT,
    "status" TEXT NOT NULL DEFAULT 'UNKNOWN',
    "mac_address" TEXT,
    "ip_address" TEXT,
    "vlan" INTEGER,
    "description" TEXT,
    "rx_power" DECIMAL(10,2),
    "tx_power" DECIMAL(10,2),
    "temperature" DECIMAL(10,2),
    "distance" DECIMAL(10,2),
    "olt_rx_power" DECIMAL(10,2),
    "last_online" TIMESTAMP(3),
    "last_offline" TIMESTAMP(3),
    "uptime_seconds" BIGINT,
    "metadata" JSONB,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "onus_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "mikrotiks" (
    "id" UUID NOT NULL,
    "device_id" UUID NOT NULL,
    "routeros_version" TEXT,
    "board_name" TEXT,
    "architecture" TEXT,
    "api_protocol" TEXT NOT NULL DEFAULT 'API',
    "api_port" INTEGER NOT NULL DEFAULT 8728,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "mikrotiks_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "network_nodes" (
    "id" UUID NOT NULL,
    "name" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "latitude" DECIMAL(10,8) NOT NULL,
    "longitude" DECIMAL(11,8) NOT NULL,
    "address" TEXT,
    "parent_node_id" UUID,
    "pop_id" UUID,
    "status" TEXT NOT NULL DEFAULT 'ACTIVE',
    "metadata" JSONB,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "network_nodes_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "network_links" (
    "id" UUID NOT NULL,
    "source_device_id" UUID NOT NULL,
    "target_device_id" UUID NOT NULL,
    "link_type" TEXT,
    "status" TEXT,
    "description" TEXT,
    "geometry" JSONB,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "network_links_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "fiber_routes" (
    "id" UUID NOT NULL,
    "name" TEXT NOT NULL,
    "fiber_type" TEXT,
    "total_length_km" DECIMAL(10,3),
    "source_node_id" UUID NOT NULL,
    "target_node_id" UUID NOT NULL,
    "geometry" JSONB,
    "status" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "fiber_routes_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "alarms" (
    "id" UUID NOT NULL,
    "device_id" UUID NOT NULL,
    "severity" TEXT NOT NULL,
    "alarm_type" TEXT NOT NULL,
    "message" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'NEW',
    "acknowledged_by_id" UUID,
    "acknowledged_at" TIMESTAMP(3),
    "resolved_at" TIMESTAMP(3),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "alarms_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "alarm_rules" (
    "id" UUID NOT NULL,
    "name" TEXT NOT NULL,
    "condition_type" TEXT NOT NULL,
    "device_type" TEXT,
    "metric_name" TEXT,
    "operator" TEXT,
    "threshold" DECIMAL(10,2),
    "severity" TEXT NOT NULL,
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "notification_channels" JSONB,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "alarm_rules_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "notification_channels" (
    "id" UUID NOT NULL,
    "name" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "config_enc" JSONB,
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "notification_channels_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "audit_logs" (
    "id" UUID NOT NULL,
    "user_id" UUID,
    "action" TEXT NOT NULL,
    "resource_type" TEXT,
    "resource_id" TEXT,
    "ip_address" TEXT,
    "user_agent" TEXT,
    "details" JSONB,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "audit_logs_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "genieacs_configs" (
    "id" UUID NOT NULL,
    "name" TEXT NOT NULL,
    "url" TEXT NOT NULL,
    "username_enc" TEXT,
    "password_enc" TEXT,
    "timeout" INTEGER NOT NULL DEFAULT 5000,
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "genieacs_configs_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "users_email_key" ON "users"("email");

-- CreateIndex
CREATE UNIQUE INDEX "roles_name_key" ON "roles"("name");

-- CreateIndex
CREATE UNIQUE INDEX "permissions_code_key" ON "permissions"("code");

-- CreateIndex
CREATE UNIQUE INDEX "pops_code_key" ON "pops"("code");

-- CreateIndex
CREATE INDEX "devices_ip_address_idx" ON "devices"("ip_address");

-- CreateIndex
CREATE INDEX "devices_serial_number_idx" ON "devices"("serial_number");

-- CreateIndex
CREATE INDEX "devices_status_idx" ON "devices"("status");

-- CreateIndex
CREATE UNIQUE INDEX "device_credentials_device_id_key" ON "device_credentials"("device_id");

-- CreateIndex
CREATE UNIQUE INDEX "olts_device_id_key" ON "olts"("device_id");

-- CreateIndex
CREATE INDEX "onus_serial_number_idx" ON "onus"("serial_number");

-- CreateIndex
CREATE INDEX "onus_status_idx" ON "onus"("status");

-- CreateIndex
CREATE UNIQUE INDEX "mikrotiks_device_id_key" ON "mikrotiks"("device_id");

-- AddForeignKey
ALTER TABLE "user_roles" ADD CONSTRAINT "user_roles_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "user_roles" ADD CONSTRAINT "user_roles_role_id_fkey" FOREIGN KEY ("role_id") REFERENCES "roles"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "role_permissions" ADD CONSTRAINT "role_permissions_role_id_fkey" FOREIGN KEY ("role_id") REFERENCES "roles"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "role_permissions" ADD CONSTRAINT "role_permissions_permission_id_fkey" FOREIGN KEY ("permission_id") REFERENCES "permissions"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "devices" ADD CONSTRAINT "devices_pop_id_fkey" FOREIGN KEY ("pop_id") REFERENCES "pops"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "device_credentials" ADD CONSTRAINT "device_credentials_device_id_fkey" FOREIGN KEY ("device_id") REFERENCES "devices"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "device_interfaces" ADD CONSTRAINT "device_interfaces_device_id_fkey" FOREIGN KEY ("device_id") REFERENCES "devices"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "olts" ADD CONSTRAINT "olts_device_id_fkey" FOREIGN KEY ("device_id") REFERENCES "devices"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "olt_boards" ADD CONSTRAINT "olt_boards_olt_id_fkey" FOREIGN KEY ("olt_id") REFERENCES "olts"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "olt_pon_ports" ADD CONSTRAINT "olt_pon_ports_olt_id_fkey" FOREIGN KEY ("olt_id") REFERENCES "olts"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "onus" ADD CONSTRAINT "onus_olt_id_fkey" FOREIGN KEY ("olt_id") REFERENCES "olts"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "onus" ADD CONSTRAINT "onus_pon_port_id_fkey" FOREIGN KEY ("pon_port_id") REFERENCES "olt_pon_ports"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "mikrotiks" ADD CONSTRAINT "mikrotiks_device_id_fkey" FOREIGN KEY ("device_id") REFERENCES "devices"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "network_nodes" ADD CONSTRAINT "network_nodes_parent_node_id_fkey" FOREIGN KEY ("parent_node_id") REFERENCES "network_nodes"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "network_nodes" ADD CONSTRAINT "network_nodes_pop_id_fkey" FOREIGN KEY ("pop_id") REFERENCES "pops"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "network_links" ADD CONSTRAINT "network_links_source_device_id_fkey" FOREIGN KEY ("source_device_id") REFERENCES "devices"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "network_links" ADD CONSTRAINT "network_links_target_device_id_fkey" FOREIGN KEY ("target_device_id") REFERENCES "devices"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "fiber_routes" ADD CONSTRAINT "fiber_routes_source_node_id_fkey" FOREIGN KEY ("source_node_id") REFERENCES "network_nodes"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "fiber_routes" ADD CONSTRAINT "fiber_routes_target_node_id_fkey" FOREIGN KEY ("target_node_id") REFERENCES "network_nodes"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "alarms" ADD CONSTRAINT "alarms_device_id_fkey" FOREIGN KEY ("device_id") REFERENCES "devices"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "alarms" ADD CONSTRAINT "alarms_acknowledged_by_id_fkey" FOREIGN KEY ("acknowledged_by_id") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "audit_logs" ADD CONSTRAINT "audit_logs_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;
