import { useState } from 'react';
import { Checkbox } from '@/components/ui/checkbox';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';

function MapConfigurations() {
  const [coordFormat, setCoordFormat] = useState("Degrees, Minutes, Seconds");
  const [verticalExaggeration, setVerticalExaggeration] = useState(false);
  const [basemapLabels, setBasemapLabels] = useState(false);

  const handleCoordFormatChange = (value: string) => {
    if (value) {
      setCoordFormat(value);
    }
  };

  return (
    <div className="p-4 bg-background">
      <div className="mb-4">
        <h3 className="text-lg font-medium mb-2">Map Configurations</h3>
      </div>

      <div className="mb-4">
        <h4 className="text-md font-medium mb-2">Location Coordinate Format</h4>
        <div className="border-2 border-secondary rounded-md p-2">
          <RadioGroup
            value={coordFormat}
            onValueChange={handleCoordFormatChange}
            className="grid grid-cols-1 sm:grid-cols-2 gap-2"
          >
            <div className="flex">
              <RadioGroupItem value="Decimal Degrees" id="decimal-degrees" className="peer sr-only" />
              <Label
                htmlFor="decimal-degrees"
                className="flex flex-1 items-center justify-center rounded-md border-2 border-muted bg-popover p-1 text-center hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary peer-data-[state=checked]:bg-primary peer-data-[state=checked]:hover:bg-primary/90 [&:has([data-state=checked])]:border-primary [&:has([data-state=checked])]:hover:border-primary/90 [&:has([data-state=checked])]:bg-primary [&:has([data-state=checked])]:text-white"
              >
                Decimal Degrees
              </Label>
            </div>
            <div className="flex">
              <RadioGroupItem value="Degrees, Minutes, Seconds" id="dms" className="peer sr-only" />
              <Label
                htmlFor="dms"
                className="flex flex-1 items-center justify-center rounded-md border-2 border-muted bg-popover p-1 text-center hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary peer-data-[state=checked]:bg-primary peer-data-[state=checked]:hover:bg-primary/90 [&:has([data-state=checked])]:border-primary [&:has([data-state=checked])]:hover:border-primary/90 [&:has([data-state=checked])]:bg-primary [&:has([data-state=checked])]:text-white"
              >
                Degrees, Minutes, Seconds
              </Label>
            </div>
          </RadioGroup>
        </div>
      </div>

      <div className="mb-4">
        <div className="flex items-center">
          <Checkbox
            checked={verticalExaggeration}
            onClick={() => setVerticalExaggeration(!verticalExaggeration)}
          />
          <label className="ml-2">Toggle Vertical Exaggeration</label>
        </div>
        <p className="text-gray-400 ml-6 text-sm">3D view only</p>
        <div className="flex items-center mt-2">
          <Checkbox
            checked={basemapLabels}
            onClick={() => setBasemapLabels(!basemapLabels)}
          />
          <label className="ml-2">Toggle Basemap Labels</label>
        </div>
      </div>

      <div className="mb-4">
        <Button variant="link" onClick={() => window.location.href = "https://google.com/"} className="mt-2"> Reload map in 2D mode</Button>
        <p className="text-gray-400 ml-2 text-sm">3D view only</p>
      </div>
    </div>
  );
}

export default MapConfigurations;
