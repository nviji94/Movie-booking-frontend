import { Button, Stack } from "@mui/material";

interface TabsProps {
  tabs: string[];
  currentTab: string;
  onTabChange: (tab: string) => void;
}

export default function Tabs({ tabs, currentTab, onTabChange }: TabsProps) {
  return (
    <Stack direction="row" spacing={2} mb={3}>
      {tabs.map((tab) => (
        <Button
          key={tab}
          onClick={() => onTabChange(tab)}
          variant={currentTab === tab ? "contained" : "outlined"}
          sx={{
            textTransform: "capitalize",
            color:
              currentTab === tab ? "var(--text-light)" : "var(--text-light)",
            backgroundColor:
              currentTab === tab ? "var(--primary)" : "var(--bg-darker)",
            borderColor: "var(--text-light)",
            "&:hover": {
              backgroundColor:
                currentTab === tab ? "var(--primary-dark)" : "var(--bg-dark)",
            },
            fontWeight: "600",
            borderRadius: "8px 8px 0 0",
          }}
        >
          {tab}
        </Button>
      ))}
    </Stack>
  );
}
