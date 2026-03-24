import { useState, useRef } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Camera, X, Scan } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface QuickScanProps {
  onItemScanned: (barcode: string) => void;
}

export function QuickScan({ onItemScanned }: QuickScanProps) {
  const [isScanning, setIsScanning] = useState(false);
  const [manualBarcode, setManualBarcode] = useState("");
  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const { toast } = useToast();

  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: "environment" }
      });
      
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        streamRef.current = stream;
        setIsScanning(true);
      }
    } catch (error) {
      toast({
        title: "Camera Error",
        description: "Unable to access camera. Please check permissions or enter barcode manually.",
        variant: "destructive",
      });
    }
  };

  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }
    setIsScanning(false);
  };

  const handleManualSubmit = () => {
    if (manualBarcode.trim()) {
      onItemScanned(manualBarcode.trim());
      setManualBarcode("");
      toast({
        title: "Barcode Scanned",
        description: `Looking up item with barcode: ${manualBarcode}`,
      });
    }
  };

  const simulateBarcodeScan = () => {
    // Simulate scanning a common product barcode
    const sampleBarcodes = [
      "012345678905", // iPhone 14 Pro
      "885909950379", // MacBook Pro
      "887276318158", // Samsung Galaxy
    ];
    const randomBarcode = sampleBarcodes[Math.floor(Math.random() * sampleBarcodes.length)];
    onItemScanned(randomBarcode);
    stopCamera();
    toast({
      title: "Item Scanned",
      description: `Found barcode: ${randomBarcode}`,
    });
  };

  return (
    <Card className="bg-dark-secondary border-accent-gray/30 p-6">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Scan className="w-5 h-5 text-gold" />
          <h3 className="text-lg font-semibold text-white">Quick Scan</h3>
        </div>
        {isScanning && (
          <Button
            onClick={stopCamera}
            variant="ghost"
            size="sm"
            className="text-gray-400 hover:text-white"
          >
            <X className="w-4 h-4" />
          </Button>
        )}
      </div>

      {!isScanning ? (
        <div className="space-y-4">
          <div className="text-center">
            <Button
              onClick={startCamera}
              className="bg-gold hover:bg-gold/90 text-dark-primary font-medium"
            >
              <Camera className="w-4 h-4 mr-2" />
              Start Camera Scan
            </Button>
          </div>
          
          <div className="text-center text-gray-400">or</div>
          
          <div className="flex gap-2">
            <Input
              placeholder="Enter barcode manually"
              value={manualBarcode}
              onChange={(e) => setManualBarcode(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleManualSubmit()}
              className="bg-dark-primary border-accent-gray/50 text-white"
            />
            <Button
              onClick={handleManualSubmit}
              disabled={!manualBarcode.trim()}
              className="bg-gold hover:bg-gold/90 text-dark-primary"
            >
              Scan
            </Button>
          </div>
        </div>
      ) : (
        <div className="space-y-4">
          <div className="relative">
            <video
              ref={videoRef}
              autoPlay
              playsInline
              className="w-full h-48 bg-black rounded-lg object-cover"
            />
            <div className="absolute inset-0 border-2 border-gold rounded-lg pointer-events-none">
              <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-32 h-32 border-2 border-gold border-dashed rounded-lg"></div>
            </div>
          </div>
          
          <div className="text-center space-y-2">
            <p className="text-gray-300">Point camera at barcode</p>
            <Button
              onClick={simulateBarcodeScan}
              variant="outline"
              className="border-gold text-gold hover:bg-gold hover:text-dark-primary"
            >
              Simulate Scan (Demo)
            </Button>
          </div>
        </div>
      )}
    </Card>
  );
}