-- CreateTable
CREATE TABLE "Sensor" (
    "id" SERIAL NOT NULL,
    "codename" TEXT NOT NULL,
    "frequency" INTEGER NOT NULL,
    "transparency" INTEGER NOT NULL,
    "temperature" DOUBLE PRECISION NOT NULL,
    "x" DOUBLE PRECISION NOT NULL,
    "y" DOUBLE PRECISION NOT NULL,
    "z" DOUBLE PRECISION NOT NULL,
    "groupId" INTEGER,

    CONSTRAINT "Sensor_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Group" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "Group_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Fish" (
    "id" SERIAL NOT NULL,
    "type" TEXT NOT NULL,
    "count" INTEGER NOT NULL,
    "sensorId" INTEGER,

    CONSTRAINT "Fish_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Sensor" ADD CONSTRAINT "Sensor_groupId_fkey" FOREIGN KEY ("groupId") REFERENCES "Group"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Fish" ADD CONSTRAINT "Fish_sensorId_fkey" FOREIGN KEY ("sensorId") REFERENCES "Sensor"("id") ON DELETE CASCADE ON UPDATE CASCADE;
