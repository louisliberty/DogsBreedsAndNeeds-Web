import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Heart, ArrowLeft, ExternalLink, Mail, Phone } from "lucide-react";
import { Link } from "wouter";
import { useCanonical } from "@/hooks/useCanonical";
import { usePageMeta } from "@/hooks/usePageMeta";
import { getBreedImage } from "@/lib/breedImages";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

interface RescueOrg {
  name: string;
  state: string;
  email?: string;
  website?: string;
  phone?: string;
  note?: string;
}

const rescueOrganizations: RescueOrg[] = [
  { name: "The Poodle Patch Rescue", state: "AR", email: "info@poodlepatchrescue.com", website: "https://www.poodlepatchrescue.com" },
  { name: "Arizona Poodle Rescue", state: "AZ", email: "arizonapoodlerescue@aol.com", website: "http://arizonapoodlerescue.org" },
  { name: "NorCal Poodle Rescue", state: "CA", email: "norcalpoodlerescueinc@gmail.com", website: "http://www.norcalpoodlerescueadoption.com" },
  { name: "Poodles and Pals of Southern California", state: "CA", email: "info@poodlesandpals.com", website: "https://www.poodlesandpals.com" },
  { name: "Poodle Rescue of Connecticut", state: "CT", email: "poodlerescuect@yahoo.com", website: "https://www.poodlerescuect.org" },
  { name: "Coastal Poodle Rescue", state: "FL", email: "cprinfo@coastalpoodlerescue.org", website: "https://www.coastalpoodlerescue.org" },
  { name: "Florida Poodle Rescue", state: "FL", email: "info@floridapoodlerescue.org", website: "https://www.floridapoodlerescue.org" },
  { name: "Standard Poodle Rescue of Pensacola", state: "FL", email: "brenda@standardpoodlerescue.net", website: "https://www.standardpoodlerescue.net" },
  { name: "Creole Poodle Rescue", state: "LA", email: "creolepoodlerescue@yahoo.com", website: "http://www.petfinder.com/shelters/LA135.html" },
  { name: "Poodle Rescue of New England", state: "MA", email: "poodlerescue@poodlerescuene.org", website: "https://www.poodlerescuene.org" },
  { name: "Mid-Atlantic Poodle Rescue", state: "MD", email: "cindy@maprescue.org", website: "https://www.midatlanticpoodlerescue.org" },
  { name: "Picket Fence Poodle Rescue", state: "MN", email: "gail@picketspoodles.com", website: "https://www.picketspoodles.com" },
  { name: "Heart of America Poodle Rescue", state: "MO", email: "heartofamerica99@aol.com", website: "http://www.petfinder.com/shelters/heartofamerica/html" },
  { name: "Watchung Mountain Poodle Rescue", state: "NJ", email: "cindy@maprescue.org", website: "https://www.midatlanticpoodlerescue.org" },
  { name: "Enchanted Poodle Club Rescue", state: "NM", email: "epcpoodlerescue@gmail.com", website: "https://www.enchantedpoodleclub.com" },
  { name: "Standard Poodle Rescue of the Southwest", state: "NM", email: "standardpood05@gmail.com" },
  { name: "Oklahoma Orphaned Poodle Services", state: "OK" },
  { name: "Carolina Poodle Rescue", state: "SC", email: "donna@carolinapoodlerescue.org", website: "https://www.carolinapoodlerescue.org" },
  { name: "Central Carolina Poodle Rescue", state: "SC" },
  { name: "North Texas Poodle Rescue", state: "TX" },
  { name: "Houston Poodle Rescue", state: "TX", email: "PRHInfo1@gmail.com" },
  { name: "Tidelands Poodle Rescue", state: "VA", email: "TPCrescue@yahoo.com", website: "https://www.tidelandspoodleclub.org/rescue" },
  { name: "Poodle Rescue of Vermont", state: "VT", email: "info@poodlerescuevt.org", website: "https://www.poodlerescuevt.org" },
  { name: "Puget Sound Poodle Club Rescue", state: "WA", phone: "253.876.4011 (Pacific time)", note: "Contact: Nancy Lillie", website: "https://www.pugetsoundpoodleclub.org" },
];

export default function PoodleRescue() {
  useCanonical("/poodle-rescue");
  usePageMeta(
    "Poodle Rescue Organizations: Find a Poodle to Adopt Near You | Dog Breeds & Needs",
    "Directory of national Poodle rescue organizations across the United States. Find a Poodle rescue near you with contact information, email addresses, and websites."
  );

  const poodleImage = getBreedImage("poodle");

  return (
    <div className="py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto">
        <div className="flex gap-2 mb-4">
          <Link href="/find-a-breeder">
            <Button variant="ghost" data-testid="button-back-breeder-finder">
              <ArrowLeft className="mr-2 h-4 w-4" /> Breeder Finder
            </Button>
          </Link>
          <Link href="/breeds/poodle">
            <Button variant="ghost" data-testid="button-back-poodle-profile">
              Poodle Profile
            </Button>
          </Link>
        </div>

        <div className="text-center mb-10">
          <Heart className="h-12 w-12 mx-auto text-primary mb-4" />
          <h1 className="text-3xl sm:text-4xl font-bold mb-3" data-testid="text-poodle-rescue-title">
            National Poodle Rescue Organizations
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Find a Poodle rescue organization near you. These groups are dedicated to rehoming Poodles of all sizes — Standard, Miniature, and Toy — across the United States.
          </p>
        </div>

        {poodleImage && (
          <div className="flex justify-center mb-8">
            <img
              src={poodleImage}
              alt="Poodle dog breed portrait"
              className="w-48 h-36 rounded-xl object-cover"
            />
          </div>
        )}

        <Card className="mb-8" data-testid="card-poodle-rescue-table">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Heart className="h-5 w-5 text-primary" />
              Poodle Rescue Directory
              <Badge variant="outline" className="ml-2">{rescueOrganizations.length} Organizations</Badge>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="min-w-[200px]">Organization</TableHead>
                    <TableHead className="w-[60px]">State</TableHead>
                    <TableHead className="min-w-[200px]">Contact</TableHead>
                    <TableHead className="min-w-[180px]">Website</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {rescueOrganizations.map((org, i) => (
                    <TableRow key={i} data-testid={`row-rescue-${i}`}>
                      <TableCell className="font-medium">{org.name}</TableCell>
                      <TableCell>
                        <Badge variant="outline">{org.state}</Badge>
                      </TableCell>
                      <TableCell>
                        <div className="space-y-1">
                          {org.email && (
                            <a
                              href={`mailto:${org.email}`}
                              className="flex items-center gap-1.5 text-sm text-primary hover:underline"
                              data-testid={`link-email-${i}`}
                            >
                              <Mail className="h-3.5 w-3.5 shrink-0" />
                              <span className="break-all">{org.email}</span>
                            </a>
                          )}
                          {org.phone && (
                            <span className="flex items-center gap-1.5 text-sm text-muted-foreground">
                              <Phone className="h-3.5 w-3.5 shrink-0" />
                              {org.phone}
                            </span>
                          )}
                          {org.note && (
                            <span className="text-xs text-muted-foreground">{org.note}</span>
                          )}
                          {!org.email && !org.phone && !org.note && (
                            <span className="text-sm text-muted-foreground">—</span>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>
                        {org.website ? (
                          <a
                            href={org.website}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center gap-1.5 text-sm text-primary hover:underline"
                            data-testid={`link-website-${i}`}
                          >
                            <ExternalLink className="h-3.5 w-3.5 shrink-0" />
                            <span className="break-all">{org.website.replace(/^https?:\/\/(www\.)?/, "")}</span>
                          </a>
                        ) : (
                          <span className="text-sm text-muted-foreground">—</span>
                        )}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>

        <Card className="border-primary/20 bg-primary/5">
          <CardContent className="p-6 text-center">
            <p className="text-sm text-muted-foreground mb-4">
              Looking for more information about the Poodle breed before adopting? View the full breed profile or find an ethical breeder.
            </p>
            <div className="flex flex-wrap justify-center gap-3">
              <Link href="/breeds/poodle">
                <Button variant="outline" data-testid="link-poodle-profile">
                  Poodle Breed Profile
                </Button>
              </Link>
              <Link href="/find-a-breeder">
                <Button data-testid="link-breeder-finder">
                  Find an Ethical Breeder
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
