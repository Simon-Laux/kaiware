import React, { useEffect, useState } from 'react';
import { useHistory, useLocation } from 'react-router';
import { usePanels } from '../contexts/PanelsProvider';
import { DeviceInfo } from '../models';
import { getDeviceInfo } from '../services/device';
import { IconButton } from '../ui-components/IconButton';
import { Typography } from '../ui-components/Typography';
import { delay } from '../utils/delay';
import styles from './Sidebar.module.css';
import { SidebarItem } from './SidebarItem';

export function Sidebar(): JSX.Element {
  const [device, setDevice] = useState<DeviceInfo>();
  const [searching, setSearching] = useState(false);
  const history = useHistory();
  const loc = useLocation();

  const { setPanels } = usePanels();

  useEffect(() => {
    refreshDevice();
  }, []);

  async function refreshDevice() {
    if (searching) return;

    setSearching(true);
    await delay(1000);
    const res = await getDeviceInfo().catch((err) => console.log('init err', err));
    if (res) {
      setDevice(res);
    } else {
      setDevice(undefined);
    }
    setSearching(false);
  }

  function navigate(path: string) {
    setPanels([]);
    history.push(path);
  }

  return (
    <div className={styles.root}>
      <div className={styles.titlebar} />
      <div className={styles.items}>
        <SidebarItem
          primaryText="Home"
          disabled={loc.pathname === '/'}
          onClick={() => navigate(`/`)}
        />
        <Typography type="titleSmall">Apps</Typography>
        <SidebarItem
          primaryText="Search"
          disabled={loc.pathname === '/search'}
          onClick={() => navigate(`/search`)}
        />
        <SidebarItem
          primaryText="Categories"
          disabled={loc.pathname === '/categories'}
          onClick={() => navigate(`/categories`)}
        />
        <Typography type="titleSmall">System</Typography>
        <SidebarItem
          primaryText="Settings"
          disabled={loc.pathname === '/settings'}
          onClick={() => navigate(`/settings`)}
        />
        <SidebarItem primaryText="About" />
        <div className={styles.spacer} />
        <Typography type="titleSmall">Device</Typography>
        {device ? (
          <SidebarItem
            primaryText={device.name}
            secondaryText="Connected"
            disabled={loc.pathname === '/device'}
            onClick={() => navigate(`/device`)}
          >
            <IconButton
              className={styles.btnRefresh}
              icon="refresh"
              animation="spin"
              onClick={() => refreshDevice()}
            />
          </SidebarItem>
        ) : (
          <SidebarItem primaryText="No Device">
            <IconButton
              className={styles.btnRefresh}
              icon="refresh"
              animation="spin"
              onClick={() => refreshDevice()}
            />
          </SidebarItem>
        )}
      </div>
    </div>
  );
}
