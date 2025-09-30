import os from "os";
import osu from "os-utils";
import checkDiskSpace from "check-disk-space";

/**
 * @swagger
 * /api/metrics:
 *   get:
 *     summary: Obtener métricas del servidor
 *     description: Retorna información en tiempo real sobre el uso de CPU, memoria, disco, red y otros parámetros del servidor.
 *     tags:
 *       - Monitoreo
 *     responses:
 *       200:
 *         description: Métricas obtenidas correctamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 cpuUsage:
 *                   type: string
 *                   example: "23.45%"
 *                   description: Porcentaje actual de uso de CPU.
 *                 memory:
 *                   type: object
 *                   properties:
 *                     total:
 *                       type: string
 *                       example: "16384.00 MB"
 *                     used:
 *                       type: string
 *                       example: "10240.50 MB"
 *                     free:
 *                       type: string
 *                       example: "6143.50 MB"
 *                 disk:
 *                   type: object
 *                   properties:
 *                     total:
 *                       type: string
 *                       example: "500.00 GB"
 *                     free:
 *                       type: string
 *                       example: "200.50 GB"
 *                 network:
 *                   type: object
 *                   properties:
 *                     download:
 *                       type: string
 *                       example: "85.50 Mbps"
 *                     upload:
 *                       type: string
 *                       example: "45.20 Mbps"
 *                     ping:
 *                       type: string
 *                       example: "15 ms"
 *                 uptime:
 *                   type: string
 *                   example: "120.50 minutes"
 *                 loadAverage:
 *                   type: array
 *                   items:
 *                     type: number
 *                   example: [0.15, 0.10, 0.05]
 *       500:
 *         description: Error interno al obtener métricas
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Error fetching metrics"
 *                 error:
 *                   type: object
 */

export const getServerMetrics = async (req, res) => {
  try {
    osu.cpuUsage(async (cpuPercent) => {
      const totalMem = os.totalmem() / 1024 / 1024; // MB
      const freeMem = os.freemem() / 1024 / 1024;
      const usedMem = totalMem - freeMem;
      const uptime = os.uptime();
      const loadAverage = os.loadavg();

      // ✅ Detecta la ruta del disco según el sistema operativo
      const diskPath = os.platform() === "win32" ? "C:\\" : "/";

      const diskInfo = await checkDiskSpace(diskPath);
      const freeDisk = diskInfo.free / 1024 / 1024 / 1024;
      const totalDisk = diskInfo.size / 1024 / 1024 / 1024;

      res.status(200).json({
        cpuUsage: `${(cpuPercent * 100).toFixed(2)}%`,
        memory: {
          total: `${totalMem.toFixed(2)} MB`,
          used: `${usedMem.toFixed(2)} MB`,
          free: `${freeMem.toFixed(2)} MB`,
        },
        disk: {
          total: `${totalDisk.toFixed(2)} GB`,
          free: `${freeDisk.toFixed(2)} GB`,
        },
        network: {
          download: `${(netSpeed.download.bandwidth / 125000).toFixed(2)} Mbps`,
          upload: `${(netSpeed.upload.bandwidth / 125000).toFixed(2)} Mbps`,
          ping: `${netSpeed.ping.latency} ms`
        },
        uptime: `${(uptime / 60).toFixed(2)} minutes`,
        loadAverage,
      });
    });
  } catch (error) {
    res.status(500).json({ message: "Error fetching metrics", error });
  }
};
