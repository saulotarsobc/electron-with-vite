import {
  ActionIcon,
  Group,
  Text,
  Tooltip,
  UnstyledButton,
} from "@mantine/core";
import {
  IconHome,
  IconMessageCircle,
  IconPhoto,
  IconSearch,
  IconSettings,
  IconUser,
} from "@tabler/icons-react";
import { useLocation, useNavigate } from "react-router-dom";
import classes from "./Navbar.module.css";

interface NavbarLinkProps {
  icon: React.ComponentType<any>;
  label: string;
  path: string;
  active?: boolean;
  onClick: () => void;
}

function NavbarLink({ icon: Icon, label, active, onClick }: NavbarLinkProps) {
  return (
    <Tooltip label={label} position="right" transitionProps={{ duration: 0 }}>
      <UnstyledButton
        onClick={onClick}
        className={classes.link}
        data-active={active || undefined}
      >
        <Icon size={20} stroke={1.5} />
      </UnstyledButton>
    </Tooltip>
  );
}

const mockdata = [
  { icon: IconHome, label: "Home", path: "/home" },
  { icon: IconPhoto, label: "Gallery", path: "/gallery" },
  { icon: IconMessageCircle, label: "Messages", path: "/messages" },
  { icon: IconSearch, label: "Search", path: "/search" },
  { icon: IconUser, label: "Profile", path: "/profile" },
  { icon: IconSettings, label: "Settings", path: "/settings" },
];

export function Navbar() {
  const navigate = useNavigate();
  const location = useLocation();

  const links = mockdata.map((link) => (
    <NavbarLink
      {...link}
      key={link.label}
      active={location.pathname === link.path}
      onClick={() => navigate(link.path)}
    />
  ));

  return (
    <nav className={classes.navbar}>
      <div className={classes.navbarMain}>
        <Group className={classes.header} justify="center">
          <ActionIcon variant="light" size="lg">
            <Text size="sm" fw={700}>
              SC
            </Text>
          </ActionIcon>
        </Group>
        {links}
      </div>
    </nav>
  );
}
