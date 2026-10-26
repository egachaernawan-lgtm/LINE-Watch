/* @ds-bundle: {"format":4,"namespace":"LINEWatchDesignSystem_35397f","components":[{"name":"Button","sourcePath":"components/actions/Button.jsx"},{"name":"IconButton","sourcePath":"components/actions/IconButton.jsx"},{"name":"Avatar","sourcePath":"components/display/Avatar.jsx"},{"name":"Badge","sourcePath":"components/display/Badge.jsx"},{"name":"Card","sourcePath":"components/display/Card.jsx"},{"name":"ListRow","sourcePath":"components/display/ListRow.jsx"},{"name":"Tag","sourcePath":"components/display/Tag.jsx"},{"name":"Banner","sourcePath":"components/feedback/Banner.jsx"},{"name":"Dialog","sourcePath":"components/feedback/Dialog.jsx"},{"name":"Toast","sourcePath":"components/feedback/Toast.jsx"},{"name":"Tooltip","sourcePath":"components/feedback/Tooltip.jsx"},{"name":"Checkbox","sourcePath":"components/forms/Checkbox.jsx"},{"name":"Input","sourcePath":"components/forms/Input.jsx"},{"name":"Select","sourcePath":"components/forms/Select.jsx"},{"name":"Switch","sourcePath":"components/forms/Switch.jsx"},{"name":"Icon","sourcePath":"components/icons/Icon.jsx"},{"name":"MentionItem","sourcePath":"components/monitoring/MentionItem.jsx"},{"name":"SentimentBar","sourcePath":"components/monitoring/SentimentBar.jsx"},{"name":"StatTile","sourcePath":"components/monitoring/StatTile.jsx"},{"name":"Tabs","sourcePath":"components/navigation/Tabs.jsx"}],"sourceHashes":{"components/actions/Button.jsx":"3f6902f3beb6","components/actions/IconButton.jsx":"05b5b1149afd","components/display/Avatar.jsx":"7d2aaa1e834a","components/display/Badge.jsx":"cae1e90b371c","components/display/Card.jsx":"31f62a9e1e72","components/display/ListRow.jsx":"d0e3cf04b7ce","components/display/Tag.jsx":"091d6659f4cb","components/feedback/Banner.jsx":"1b9ea2602390","components/feedback/Dialog.jsx":"c7402677617e","components/feedback/Toast.jsx":"a4eea18ac4b3","components/feedback/Tooltip.jsx":"91da7a9ab34c","components/forms/Checkbox.jsx":"258a9f1a9c59","components/forms/Input.jsx":"a447f64b9e1e","components/forms/Select.jsx":"379e1233796e","components/forms/Switch.jsx":"545f5b7e8ca9","components/icons/Icon.jsx":"07201193e431","components/monitoring/MentionItem.jsx":"734fb4be0d0f","components/monitoring/SentimentBar.jsx":"89cc569dff16","components/monitoring/StatTile.jsx":"b6601336f9c9","components/navigation/Tabs.jsx":"755e2cbc091a","ui_kits/line-watch/AlertsScreen.jsx":"b7b3cec703b1","ui_kits/line-watch/FeedScreen.jsx":"a1fff3f27f43","ui_kits/line-watch/MentionDrawer.jsx":"39d328e4bb31","ui_kits/line-watch/NarrativesScreen.jsx":"b155a760dd33","ui_kits/line-watch/OverviewScreen.jsx":"def42c722335","ui_kits/line-watch/Sidebar.jsx":"510b22b75a5f","ui_kits/line-watch/TopBar.jsx":"1e6b3b0f687a","ui_kits/line-watch/VolumeChart.jsx":"2d5470a495a7","ui_kits/line-watch/data.js":"2f1b03e5263e","ui_kits/line-watch/standalone-bundle.js":"e422be5f3b97"},"inlinedExternals":[],"unexposedExports":[]} */

(() => {

const __ds_ns = (window.LINEWatchDesignSystem_35397f = window.LINEWatchDesignSystem_35397f || {});

const __ds_scope = {};

(__ds_ns.__errors = __ds_ns.__errors || []);

// components/display/Avatar.jsx
try { (() => {
function Avatar({
  src,
  name = '',
  size = 48,
  square = false,
  style
}) {
  const ini = name.split(/\s+/).filter(Boolean).slice(0, 2).map(w => w[0]).join('').toUpperCase();
  return /*#__PURE__*/React.createElement("span", {
    style: {
      width: size,
      height: size,
      flex: 'none',
      borderRadius: square ? 'var(--radius-md)' : '50%',
      background: src ? 'center/cover url(' + src + ')' : 'var(--gray-100)',
      color: 'var(--gray-700)',
      display: 'inline-flex',
      alignItems: 'center',
      justifyContent: 'center',
      font: '700 ' + Math.round(size * 0.36) + 'px/1 var(--font-sans)',
      border: '1px solid var(--border-subtle)',
      overflow: 'hidden',
      ...style
    }
  }, !src && ini);
}
Object.assign(__ds_scope, { Avatar });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/display/Avatar.jsx", error: String((e && e.message) || e) }); }

// components/display/Badge.jsx
try { (() => {
function Badge({
  count,
  variant = 'notification',
  dot = false,
  children,
  style
}) {
  const bg = variant === 'new' ? 'var(--line-green)' : variant === 'neutral' ? 'var(--gray-500)' : 'var(--red-500)';
  if (dot) return /*#__PURE__*/React.createElement("span", {
    style: {
      display: 'inline-block',
      width: 8,
      height: 8,
      borderRadius: '50%',
      background: bg,
      ...style
    }
  });
  return /*#__PURE__*/React.createElement("span", {
    style: {
      display: 'inline-flex',
      alignItems: 'center',
      justifyContent: 'center',
      minWidth: 18,
      padding: '2px 6px',
      borderRadius: 'var(--radius-full)',
      background: bg,
      color: '#fff',
      font: 'var(--type-badge)',
      ...style
    }
  }, children ?? (count > 99 ? '99+' : count));
}
Object.assign(__ds_scope, { Badge });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/display/Badge.jsx", error: String((e && e.message) || e) }); }

// components/display/Card.jsx
try { (() => {
function Card({
  title,
  subtitle,
  action,
  padding = 20,
  interactive = false,
  onClick,
  children,
  style
}) {
  const [h, setH] = React.useState(false);
  return /*#__PURE__*/React.createElement("div", {
    onClick: onClick,
    onMouseEnter: () => setH(true),
    onMouseLeave: () => setH(false),
    style: {
      background: 'var(--surface-card)',
      border: '1px solid var(--border-subtle)',
      borderRadius: 'var(--radius-xl)',
      padding,
      display: 'flex',
      flexDirection: 'column',
      gap: 16,
      cursor: interactive ? 'pointer' : 'default',
      boxShadow: interactive && h ? 'var(--shadow-popover)' : 'none',
      transition: 'box-shadow var(--dur-base) var(--ease-standard)',
      minWidth: 0,
      ...style
    }
  }, (title || action) && /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'flex-start',
      justifyContent: 'space-between',
      gap: 12
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      flexDirection: 'column',
      gap: 2,
      minWidth: 0
    }
  }, title && /*#__PURE__*/React.createElement("div", {
    style: {
      font: 'var(--type-headline)'
    }
  }, title), subtitle && /*#__PURE__*/React.createElement("div", {
    style: {
      font: 'var(--type-subtext)',
      color: 'var(--text-tertiary)'
    }
  }, subtitle)), action), children);
}
Object.assign(__ds_scope, { Card });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/display/Card.jsx", error: String((e && e.message) || e) }); }

// components/display/ListRow.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
function ListRow({
  avatar,
  leading,
  title,
  subtitle,
  meta,
  trailing,
  divider = true,
  selected = false,
  onClick,
  style
}) {
  const [h, setH] = React.useState(false);
  return /*#__PURE__*/React.createElement("div", {
    onClick: onClick,
    onMouseEnter: () => setH(true),
    onMouseLeave: () => setH(false),
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: 12,
      padding: '0 var(--list-pad-x)',
      background: selected ? 'var(--surface-selected)' : h && onClick ? 'var(--overlay-hover)' : 'var(--surface-base)',
      cursor: onClick ? 'pointer' : 'default',
      transition: 'background var(--dur-fast)',
      ...style
    }
  }, leading ?? (avatar !== undefined && /*#__PURE__*/React.createElement(__ds_scope.Avatar, _extends({
    name: typeof avatar === 'string' ? avatar : ''
  }, typeof avatar === 'object' ? avatar : {}))), /*#__PURE__*/React.createElement("div", {
    style: {
      flex: 1,
      minWidth: 0,
      display: 'flex',
      alignItems: 'center',
      gap: 12,
      padding: 'var(--list-pad-y) 0',
      borderBottom: divider ? '1px solid var(--divider)' : 'none'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      flex: 1,
      minWidth: 0
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      font: 'var(--type-body-bold)',
      color: 'var(--text-primary)',
      overflow: 'hidden',
      textOverflow: 'ellipsis',
      whiteSpace: 'nowrap'
    }
  }, title), subtitle && /*#__PURE__*/React.createElement("div", {
    style: {
      font: 'var(--type-subtext)',
      color: 'var(--text-tertiary)',
      overflow: 'hidden',
      textOverflow: 'ellipsis',
      whiteSpace: 'nowrap'
    }
  }, subtitle)), (meta || trailing) && /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'flex-end',
      gap: 6,
      flex: 'none'
    }
  }, meta && /*#__PURE__*/React.createElement("span", {
    style: {
      font: 'var(--type-caption)',
      color: 'var(--text-tertiary)'
    }
  }, meta), trailing)));
}
Object.assign(__ds_scope, { ListRow });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/display/ListRow.jsx", error: String((e && e.message) || e) }); }

// components/feedback/Tooltip.jsx
try { (() => {
function Tooltip({
  content,
  placement = 'top',
  open,
  children
}) {
  const [h, setH] = React.useState(false);
  const show = open ?? h;
  const pos = placement === 'bottom' ? {
    top: 'calc(100% + 8px)'
  } : {
    bottom: 'calc(100% + 8px)'
  };
  return /*#__PURE__*/React.createElement("span", {
    onMouseEnter: () => setH(true),
    onMouseLeave: () => setH(false),
    style: {
      position: 'relative',
      display: 'inline-flex'
    }
  }, children, /*#__PURE__*/React.createElement("span", {
    role: "tooltip",
    style: {
      position: 'absolute',
      left: '50%',
      ...pos,
      transform: 'translateX(-50%) translateY(' + (show ? 0 : 4) + 'px)',
      opacity: show ? 1 : 0,
      pointerEvents: 'none',
      background: 'var(--gray-900)',
      color: '#fff',
      font: 'var(--type-caption)',
      padding: '6px 10px',
      borderRadius: 'var(--radius-md)',
      whiteSpace: 'nowrap',
      boxShadow: 'var(--shadow-popover)',
      transition: 'opacity var(--dur-base), transform var(--dur-base) var(--ease-standard)',
      zIndex: 50
    }
  }, content));
}
Object.assign(__ds_scope, { Tooltip });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/feedback/Tooltip.jsx", error: String((e && e.message) || e) }); }

// components/forms/Switch.jsx
try { (() => {
function Switch({
  checked,
  defaultChecked = false,
  onChange,
  label,
  disabled = false,
  style
}) {
  const [i, setI] = React.useState(defaultChecked);
  const on = checked ?? i;
  const t = () => {
    if (disabled) return;
    setI(!on);
    onChange && onChange(!on);
  };
  return /*#__PURE__*/React.createElement("label", {
    onClick: t,
    style: {
      display: 'inline-flex',
      alignItems: 'center',
      gap: 12,
      cursor: disabled ? 'not-allowed' : 'pointer',
      font: 'var(--type-body)',
      color: disabled ? 'var(--text-disabled)' : 'var(--text-primary)',
      ...style
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      width: 44,
      height: 26,
      borderRadius: 999,
      flex: 'none',
      position: 'relative',
      background: on ? 'var(--line-green)' : 'var(--gray-300)',
      opacity: disabled ? 0.5 : 1,
      transition: 'background var(--dur-base) var(--ease-standard)'
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      position: 'absolute',
      top: 3,
      left: on ? 21 : 3,
      width: 20,
      height: 20,
      borderRadius: '50%',
      background: '#fff',
      boxShadow: '0 1px 3px rgba(0,0,0,0.2)',
      transition: 'left var(--dur-base) var(--ease-standard)'
    }
  })), label);
}
Object.assign(__ds_scope, { Switch });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/forms/Switch.jsx", error: String((e && e.message) || e) }); }

// components/icons/Icon.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
const CDN = 'https://unpkg.com/lucide-static@0.460.0/icons/';
function Icon({
  name,
  size = 20,
  color = 'currentColor',
  style,
  ...rest
}) {
  const url = 'url(' + CDN + name + '.svg)';
  return /*#__PURE__*/React.createElement("span", _extends({
    "aria-hidden": "true"
  }, rest, {
    style: {
      display: 'inline-block',
      flex: 'none',
      width: size,
      height: size,
      background: color,
      WebkitMask: url + ' center/contain no-repeat',
      mask: url + ' center/contain no-repeat',
      ...style
    }
  }));
}
Object.assign(__ds_scope, { Icon });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/icons/Icon.jsx", error: String((e && e.message) || e) }); }

// components/actions/Button.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
const V = {
  primary: {
    background: 'var(--action-primary)',
    color: 'var(--text-on-brand)',
    border: 'none'
  },
  secondary: {
    background: 'transparent',
    color: 'var(--text-primary)',
    border: '1px solid var(--border-strong)'
  },
  tertiary: {
    background: 'transparent',
    color: 'var(--text-primary)',
    border: 'none'
  },
  link: {
    background: 'transparent',
    color: 'var(--text-link)',
    border: 'none'
  },
  destructive: {
    background: 'var(--action-destructive)',
    color: 'var(--white)',
    border: 'none'
  }
};
function Button({
  variant = 'primary',
  size = 'md',
  pill = false,
  icon,
  iconRight,
  fullWidth = false,
  disabled = false,
  children,
  style,
  ...rest
}) {
  const [h, setH] = React.useState(false);
  const [p, setP] = React.useState(false);
  const v = V[variant] || V.primary;
  const bordered = variant === 'secondary';
  const pad = variant === 'tertiary' || variant === 'link' ? size === 'sm' ? '6px 12px' : '8px 16px' : size === 'sm' ? bordered ? '7px 15px' : '8px 16px' : bordered ? '11px 23px' : '12px 24px';
  let bg = v.background;
  if (!disabled && (h || p)) {
    bg = variant === 'primary' ? p ? 'var(--action-primary-pressed)' : 'var(--action-primary-pressed)' : variant === 'destructive' ? '#E62E44' : p ? 'var(--overlay-pressed)' : 'var(--overlay-hover)';
  }
  const dis = disabled ? variant === 'primary' || variant === 'destructive' ? {
    background: 'var(--gray-200)',
    color: 'var(--gray-500)'
  } : {
    color: 'var(--text-disabled)',
    borderColor: 'var(--gray-200)'
  } : {};
  return /*#__PURE__*/React.createElement("button", _extends({
    disabled: disabled,
    onMouseEnter: () => setH(true),
    onMouseLeave: () => {
      setH(false);
      setP(false);
    },
    onMouseDown: () => setP(true),
    onMouseUp: () => setP(false)
  }, rest, {
    style: {
      display: 'inline-flex',
      alignItems: 'center',
      justifyContent: 'center',
      gap: 8,
      font: size === 'sm' ? '700 14px/1 var(--font-sans)' : 'var(--type-button)',
      padding: pad,
      borderRadius: pill ? 'var(--radius-full)' : 'var(--radius-md)',
      cursor: disabled ? 'not-allowed' : 'pointer',
      width: fullWidth ? '100%' : undefined,
      transition: 'background var(--dur-fast) var(--ease-standard), transform var(--dur-fast)',
      transform: p && !disabled ? 'scale(0.98)' : 'none',
      whiteSpace: 'nowrap',
      ...v,
      background: bg,
      ...dis,
      ...style
    }
  }), icon && /*#__PURE__*/React.createElement(__ds_scope.Icon, {
    name: icon,
    size: size === 'sm' ? 16 : 18
  }), children, iconRight && /*#__PURE__*/React.createElement(__ds_scope.Icon, {
    name: iconRight,
    size: size === 'sm' ? 16 : 18
  }));
}
Object.assign(__ds_scope, { Button });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/actions/Button.jsx", error: String((e && e.message) || e) }); }

// components/actions/IconButton.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
function IconButton({
  icon,
  size = 'md',
  variant = 'ghost',
  label,
  badge,
  style,
  ...rest
}) {
  const [h, setH] = React.useState(false);
  const d = size === 'sm' ? 32 : size === 'lg' ? 48 : 40;
  const base = variant === 'filled' ? {
    background: h ? 'var(--action-primary-pressed)' : 'var(--action-primary)',
    color: '#fff',
    boxShadow: 'var(--shadow-popover)'
  } : variant === 'outline' ? {
    background: h ? 'var(--overlay-hover)' : 'transparent',
    border: '1px solid var(--border-strong)',
    color: 'var(--text-primary)'
  } : {
    background: h ? 'var(--overlay-hover)' : 'transparent',
    color: 'var(--text-primary)'
  };
  return /*#__PURE__*/React.createElement("button", _extends({
    "aria-label": label,
    title: label,
    onMouseEnter: () => setH(true),
    onMouseLeave: () => setH(false)
  }, rest, {
    style: {
      position: 'relative',
      width: d,
      height: d,
      borderRadius: 'var(--radius-full)',
      border: 'none',
      display: 'inline-flex',
      alignItems: 'center',
      justifyContent: 'center',
      cursor: 'pointer',
      padding: 0,
      transition: 'background var(--dur-fast)',
      ...base,
      ...style
    }
  }), /*#__PURE__*/React.createElement(__ds_scope.Icon, {
    name: icon,
    size: size === 'sm' ? 18 : size === 'lg' ? 24 : 20
  }), badge != null && /*#__PURE__*/React.createElement("span", {
    style: {
      position: 'absolute',
      top: 2,
      right: 2,
      minWidth: 16,
      height: 16,
      padding: '0 4px',
      borderRadius: 999,
      background: 'var(--red-500)',
      color: '#fff',
      font: 'var(--type-badge)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      boxShadow: '0 0 0 2px #fff'
    }
  }, badge));
}
Object.assign(__ds_scope, { IconButton });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/actions/IconButton.jsx", error: String((e && e.message) || e) }); }

// components/display/Tag.jsx
try { (() => {
const T = {
  positive: ['var(--sentiment-positive-bg)', '#05A648'],
  negative: ['var(--sentiment-negative-bg)', '#E0203A'],
  mixed: ['var(--sentiment-mixed-bg)', '#C77700'],
  neutral: ['var(--gray-100)', 'var(--gray-700)'],
  info: ['var(--blue-tint)', '#0066D6'],
  outline: ['transparent', 'var(--gray-700)']
};
function Tag({
  tone = 'neutral',
  dot = false,
  icon,
  onRemove,
  selected = false,
  onClick,
  children,
  style
}) {
  const [bg, fg] = selected ? ['var(--gray-900)', '#fff'] : T[tone] || T.neutral;
  return /*#__PURE__*/React.createElement("span", {
    onClick: onClick,
    style: {
      display: 'inline-flex',
      alignItems: 'center',
      gap: 6,
      padding: '4px 10px',
      borderRadius: 'var(--radius-sm)',
      background: bg,
      color: fg,
      font: '700 12px/1.4 var(--font-sans)',
      border: tone === 'outline' && !selected ? '1px solid var(--border-strong)' : 'none',
      cursor: onClick ? 'pointer' : 'default',
      whiteSpace: 'nowrap',
      ...style
    }
  }, dot && /*#__PURE__*/React.createElement("span", {
    style: {
      width: 6,
      height: 6,
      borderRadius: '50%',
      background: 'currentColor'
    }
  }), icon && /*#__PURE__*/React.createElement(__ds_scope.Icon, {
    name: icon,
    size: 14
  }), children, onRemove && /*#__PURE__*/React.createElement("span", {
    onClick: e => {
      e.stopPropagation();
      onRemove();
    },
    style: {
      display: 'flex',
      cursor: 'pointer',
      marginRight: -4
    }
  }, /*#__PURE__*/React.createElement(__ds_scope.Icon, {
    name: "x",
    size: 14
  })));
}
Object.assign(__ds_scope, { Tag });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/display/Tag.jsx", error: String((e && e.message) || e) }); }

// components/feedback/Banner.jsx
try { (() => {
const B = {
  warning: ['var(--orange-tint)', '#8A5300', 'triangle-alert', 'var(--orange-500)'],
  error: ['var(--red-tint)', '#B0142A', 'circle-alert', 'var(--red-500)'],
  info: ['var(--blue-tint)', '#004FA8', 'info', 'var(--blue-500)'],
  success: ['var(--line-green-tint)', '#036B2E', 'circle-check', 'var(--line-green)']
};
function Banner({
  tone = 'info',
  title,
  action,
  onClose,
  children,
  style
}) {
  const [bg, fg, ic, icc] = B[tone] || B.info;
  return /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'flex-start',
      gap: 12,
      padding: '12px 16px',
      borderRadius: 'var(--radius-md)',
      background: bg,
      color: fg,
      font: 'var(--type-subtext)',
      ...style
    }
  }, /*#__PURE__*/React.createElement(__ds_scope.Icon, {
    name: ic,
    size: 20,
    color: icc,
    style: {
      marginTop: 1
    }
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      flex: 1
    }
  }, title && /*#__PURE__*/React.createElement("div", {
    style: {
      fontWeight: 700
    }
  }, title), children), action, onClose && /*#__PURE__*/React.createElement("span", {
    onClick: onClose,
    style: {
      cursor: 'pointer',
      display: 'flex'
    }
  }, /*#__PURE__*/React.createElement(__ds_scope.Icon, {
    name: "x",
    size: 18
  })));
}
Object.assign(__ds_scope, { Banner });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/feedback/Banner.jsx", error: String((e && e.message) || e) }); }

// components/feedback/Dialog.jsx
try { (() => {
function Dialog({
  open = true,
  title,
  description,
  onClose,
  actions,
  sheet = false,
  width = 440,
  inline = false,
  children
}) {
  if (!open) return null;
  const panel = /*#__PURE__*/React.createElement("div", {
    role: "dialog",
    style: {
      background: 'var(--surface-elevated)',
      borderRadius: sheet ? '24px 24px 0 0' : 'var(--radius-xl)',
      boxShadow: sheet ? 'var(--shadow-sheet)' : 'var(--shadow-modal)',
      width: sheet ? '100%' : width,
      maxWidth: '100%',
      padding: 24,
      display: 'flex',
      flexDirection: 'column',
      gap: 16,
      position: 'relative'
    },
    onClick: e => e.stopPropagation()
  }, sheet && /*#__PURE__*/React.createElement("div", {
    style: {
      width: 36,
      height: 4,
      borderRadius: 2,
      background: 'var(--gray-300)',
      alignSelf: 'center',
      marginTop: -12
    }
  }), (title || onClose) && /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'flex-start',
      gap: 12
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      flex: 1,
      font: 'var(--type-title2)'
    }
  }, title), onClose && /*#__PURE__*/React.createElement(__ds_scope.IconButton, {
    icon: "x",
    label: "Close",
    size: "sm",
    onClick: onClose,
    style: {
      margin: '-4px -8px 0 0'
    }
  })), description && /*#__PURE__*/React.createElement("div", {
    style: {
      font: 'var(--type-body)',
      color: 'var(--text-secondary)',
      textWrap: 'pretty'
    }
  }, description), children, actions && /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      gap: 8,
      justifyContent: 'flex-end',
      marginTop: 8
    }
  }, actions));
  return /*#__PURE__*/React.createElement("div", {
    onClick: onClose,
    style: {
      position: inline ? 'absolute' : 'fixed',
      inset: 0,
      background: 'var(--overlay-dim)',
      display: 'flex',
      alignItems: sheet ? 'flex-end' : 'center',
      justifyContent: 'center',
      padding: sheet ? 0 : 24,
      zIndex: 100
    }
  }, panel);
}
Object.assign(__ds_scope, { Dialog });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/feedback/Dialog.jsx", error: String((e && e.message) || e) }); }

// components/feedback/Toast.jsx
try { (() => {
const I = {
  success: ['circle-check', 'var(--line-green)'],
  error: ['circle-alert', 'var(--red-500)'],
  info: ['info', '#4DA3FF'],
  none: [null]
};
function Toast({
  tone = 'none',
  action,
  onAction,
  children,
  style
}) {
  const [ic, col] = I[tone] || I.none;
  return /*#__PURE__*/React.createElement("div", {
    role: "status",
    style: {
      display: 'inline-flex',
      alignItems: 'center',
      gap: 12,
      padding: '12px 16px',
      borderRadius: 'var(--radius-lg)',
      background: 'rgba(17,17,17,0.92)',
      color: '#fff',
      font: 'var(--type-subtext)',
      boxShadow: 'var(--shadow-popover)',
      maxWidth: 480,
      ...style
    }
  }, ic && /*#__PURE__*/React.createElement(__ds_scope.Icon, {
    name: ic,
    size: 20,
    color: col
  }), /*#__PURE__*/React.createElement("span", {
    style: {
      flex: 1
    }
  }, children), action && /*#__PURE__*/React.createElement("button", {
    onClick: onAction,
    style: {
      border: 'none',
      background: 'none',
      color: 'var(--line-green)',
      font: '700 14px/1 var(--font-sans)',
      cursor: 'pointer',
      padding: 0
    }
  }, action));
}
Object.assign(__ds_scope, { Toast });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/feedback/Toast.jsx", error: String((e && e.message) || e) }); }

// components/forms/Checkbox.jsx
try { (() => {
function Checkbox({
  checked,
  defaultChecked = false,
  onChange,
  label,
  disabled = false,
  style
}) {
  const [i, setI] = React.useState(defaultChecked);
  const on = checked ?? i;
  const t = () => {
    if (disabled) return;
    setI(!on);
    onChange && onChange(!on);
  };
  return /*#__PURE__*/React.createElement("label", {
    onClick: t,
    style: {
      display: 'inline-flex',
      alignItems: 'center',
      gap: 10,
      cursor: disabled ? 'not-allowed' : 'pointer',
      font: 'var(--type-body)',
      color: disabled ? 'var(--text-disabled)' : 'var(--text-primary)',
      ...style
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      width: 20,
      height: 20,
      borderRadius: 'var(--radius-sm)',
      flex: 'none',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      background: on ? disabled ? 'var(--gray-300)' : 'var(--line-green)' : 'var(--white)',
      border: on ? 'none' : '1px solid var(--border-strong)',
      transition: 'background var(--dur-fast)'
    }
  }, on && /*#__PURE__*/React.createElement(__ds_scope.Icon, {
    name: "check",
    size: 14,
    color: "#fff"
  })), label);
}
Object.assign(__ds_scope, { Checkbox });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/forms/Checkbox.jsx", error: String((e && e.message) || e) }); }

// components/forms/Input.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
const lbl = {
  font: '700 14px/1.5 var(--font-sans)',
  color: 'var(--text-primary)'
};
const help = e => ({
  font: 'var(--type-caption)',
  color: e ? 'var(--text-error)' : 'var(--text-tertiary)'
});
function Input({
  label,
  helper,
  error,
  icon,
  variant = 'filled',
  size = 'md',
  style,
  ...rest
}) {
  const [f, setF] = React.useState(false);
  const bc = error ? 'var(--red-500)' : f ? 'var(--border-focus)' : 'var(--border-subtle)';
  return /*#__PURE__*/React.createElement("label", {
    style: {
      display: 'flex',
      flexDirection: 'column',
      gap: 6,
      ...style
    }
  }, label && /*#__PURE__*/React.createElement("span", {
    style: lbl
  }, label), /*#__PURE__*/React.createElement("span", {
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: 8,
      background: variant === 'filled' ? 'var(--surface-input)' : 'var(--white)',
      border: '1px solid ' + bc,
      borderRadius: 'var(--radius-md)',
      padding: size === 'sm' ? '8px 12px' : '12px 16px',
      color: 'var(--text-tertiary)',
      transition: 'border-color var(--dur-fast)'
    }
  }, icon && /*#__PURE__*/React.createElement(__ds_scope.Icon, {
    name: icon,
    size: 18
  }), /*#__PURE__*/React.createElement("input", _extends({
    onFocus: () => setF(true),
    onBlur: () => setF(false)
  }, rest, {
    style: {
      flex: 1,
      minWidth: 0,
      border: 'none',
      outline: 'none',
      background: 'transparent',
      font: size === 'sm' ? 'var(--type-subtext)' : 'var(--type-body)',
      color: 'var(--text-primary)',
      padding: 0
    }
  }))), (error || helper) && /*#__PURE__*/React.createElement("span", {
    style: help(error)
  }, error || helper));
}
Object.assign(__ds_scope, { Input });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/forms/Input.jsx", error: String((e && e.message) || e) }); }

// components/forms/Select.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
const lbl = {
  font: '700 14px/1.5 var(--font-sans)',
  color: 'var(--text-primary)'
};
const help = e => ({
  font: 'var(--type-caption)',
  color: e ? 'var(--text-error)' : 'var(--text-tertiary)'
});
function Select({
  label,
  options = [],
  helper,
  size = 'md',
  variant = 'filled',
  style,
  ...rest
}) {
  return /*#__PURE__*/React.createElement("label", {
    style: {
      display: 'flex',
      flexDirection: 'column',
      gap: 6,
      ...style
    }
  }, label && /*#__PURE__*/React.createElement("span", {
    style: lbl
  }, label), /*#__PURE__*/React.createElement("span", {
    style: {
      position: 'relative',
      display: 'flex'
    }
  }, /*#__PURE__*/React.createElement("select", _extends({}, rest, {
    style: {
      appearance: 'none',
      WebkitAppearance: 'none',
      width: '100%',
      font: size === 'sm' ? 'var(--type-subtext)' : 'var(--type-body)',
      color: 'var(--text-primary)',
      background: variant === 'filled' ? 'var(--surface-input)' : 'var(--white)',
      border: '1px solid var(--border-subtle)',
      borderRadius: 'var(--radius-md)',
      padding: size === 'sm' ? '8px 36px 8px 12px' : '12px 44px 12px 16px',
      cursor: 'pointer',
      outline: 'none'
    }
  }), options.map(o => typeof o === 'string' ? /*#__PURE__*/React.createElement("option", {
    key: o
  }, o) : /*#__PURE__*/React.createElement("option", {
    key: o.value,
    value: o.value
  }, o.label))), /*#__PURE__*/React.createElement(__ds_scope.Icon, {
    name: "chevron-down",
    size: 18,
    color: "var(--text-tertiary)",
    style: {
      position: 'absolute',
      right: size === 'sm' ? 10 : 14,
      top: '50%',
      transform: 'translateY(-50%)',
      pointerEvents: 'none'
    }
  })), helper && /*#__PURE__*/React.createElement("span", {
    style: help(false)
  }, helper));
}
Object.assign(__ds_scope, { Select });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/forms/Select.jsx", error: String((e && e.message) || e) }); }

// components/monitoring/MentionItem.jsx
try { (() => {
const L = {
  positive: 'Positive',
  negative: 'Negative',
  mixed: 'Mixed',
  neutral: 'Neutral'
};
function MentionItem({
  source,
  medium,
  time,
  headline,
  excerpt,
  sentiment = 'neutral',
  narrative,
  reach,
  selected = false,
  onClick,
  style
}) {
  const [h, setH] = React.useState(false);
  return /*#__PURE__*/React.createElement("article", {
    onClick: onClick,
    onMouseEnter: () => setH(true),
    onMouseLeave: () => setH(false),
    style: {
      display: 'flex',
      gap: 12,
      padding: '16px 20px',
      borderBottom: '1px solid var(--divider)',
      background: selected ? 'var(--surface-selected)' : h && onClick ? 'var(--overlay-hover)' : 'var(--surface-base)',
      cursor: onClick ? 'pointer' : 'default',
      transition: 'background var(--dur-fast)',
      ...style
    }
  }, /*#__PURE__*/React.createElement(__ds_scope.Avatar, {
    name: source,
    size: 40,
    square: true
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      flex: 1,
      minWidth: 0,
      display: 'flex',
      flexDirection: 'column',
      gap: 6
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: 6,
      font: 'var(--type-caption)',
      color: 'var(--text-tertiary)'
    }
  }, /*#__PURE__*/React.createElement("b", {
    style: {
      color: 'var(--text-primary)',
      fontWeight: 700
    }
  }, source), medium && /*#__PURE__*/React.createElement("span", null, "\xB7 ", medium), time && /*#__PURE__*/React.createElement("span", null, "\xB7 ", time)), /*#__PURE__*/React.createElement("div", {
    style: {
      font: 'var(--type-body-bold)',
      color: 'var(--text-primary)',
      textWrap: 'pretty'
    }
  }, headline), excerpt && /*#__PURE__*/React.createElement("div", {
    style: {
      font: 'var(--type-subtext)',
      color: 'var(--text-secondary)',
      display: '-webkit-box',
      WebkitLineClamp: 2,
      WebkitBoxOrient: 'vertical',
      overflow: 'hidden'
    }
  }, excerpt), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: 8,
      flexWrap: 'wrap',
      marginTop: 2
    }
  }, /*#__PURE__*/React.createElement(__ds_scope.Tag, {
    tone: sentiment,
    dot: true
  }, L[sentiment]), narrative && /*#__PURE__*/React.createElement(__ds_scope.Tag, {
    tone: "outline",
    icon: "waypoints"
  }, narrative), reach && /*#__PURE__*/React.createElement("span", {
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: 4,
      font: 'var(--type-caption)',
      color: 'var(--text-tertiary)',
      marginLeft: 'auto'
    }
  }, /*#__PURE__*/React.createElement(__ds_scope.Icon, {
    name: "eye",
    size: 14
  }), reach))));
}
Object.assign(__ds_scope, { MentionItem });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/monitoring/MentionItem.jsx", error: String((e && e.message) || e) }); }

// components/monitoring/SentimentBar.jsx
try { (() => {
const C = {
  positive: 'var(--sentiment-positive)',
  neutral: 'var(--gray-300)',
  mixed: 'var(--sentiment-mixed)',
  negative: 'var(--sentiment-negative)'
};
function SentimentBar({
  positive = 0,
  neutral = 0,
  mixed = 0,
  negative = 0,
  height = 8,
  showLegend = true,
  style
}) {
  const d = {
    positive,
    neutral,
    mixed,
    negative
  };
  const tot = Object.values(d).reduce((a, b) => a + b, 0) || 1;
  return /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      flexDirection: 'column',
      gap: 10,
      ...style
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      gap: 2,
      height,
      borderRadius: 999,
      overflow: 'hidden'
    }
  }, Object.entries(d).filter(([, v]) => v > 0).map(([k, v]) => /*#__PURE__*/React.createElement("span", {
    key: k,
    style: {
      flex: v,
      background: C[k]
    }
  }))), showLegend && /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      gap: 16,
      flexWrap: 'wrap'
    }
  }, Object.entries(d).filter(([, v]) => v > 0).map(([k, v]) => /*#__PURE__*/React.createElement("span", {
    key: k,
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: 6,
      font: 'var(--type-caption)',
      color: 'var(--text-secondary)'
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      width: 8,
      height: 8,
      borderRadius: '50%',
      background: C[k]
    }
  }), k[0].toUpperCase() + k.slice(1), " ", /*#__PURE__*/React.createElement("b", {
    style: {
      color: 'var(--text-primary)',
      fontVariantNumeric: 'tabular-nums'
    }
  }, Math.round(v / tot * 100), "%")))));
}
Object.assign(__ds_scope, { SentimentBar });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/monitoring/SentimentBar.jsx", error: String((e && e.message) || e) }); }

// components/monitoring/StatTile.jsx
try { (() => {
function StatTile({
  label,
  value,
  delta,
  deltaLabel,
  invert = false,
  icon,
  style
}) {
  const up = delta > 0;
  const good = invert ? !up : up;
  const col = delta == null || delta === 0 ? 'var(--text-tertiary)' : good ? '#05A648' : 'var(--red-500)';
  return /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      flexDirection: 'column',
      gap: 8,
      padding: 20,
      border: '1px solid var(--border-subtle)',
      borderRadius: 'var(--radius-xl)',
      background: 'var(--surface-card)',
      minWidth: 0,
      ...style
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: 6,
      font: 'var(--type-subtext)',
      color: 'var(--text-secondary)'
    }
  }, icon && /*#__PURE__*/React.createElement(__ds_scope.Icon, {
    name: icon,
    size: 16
  }), label), /*#__PURE__*/React.createElement("div", {
    style: {
      font: '800 32px/1.2 var(--font-sans)',
      fontVariantNumeric: 'tabular-nums',
      letterSpacing: '-0.5px'
    }
  }, value), delta != null && /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: 4,
      font: '700 12px/1.4 var(--font-sans)',
      color: col
    }
  }, /*#__PURE__*/React.createElement(__ds_scope.Icon, {
    name: up ? 'arrow-up-right' : delta < 0 ? 'arrow-down-right' : 'minus',
    size: 14
  }), Math.abs(delta), "%", /*#__PURE__*/React.createElement("span", {
    style: {
      fontWeight: 400,
      color: 'var(--text-tertiary)',
      marginLeft: 4
    }
  }, deltaLabel)));
}
Object.assign(__ds_scope, { StatTile });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/monitoring/StatTile.jsx", error: String((e && e.message) || e) }); }

// components/navigation/Tabs.jsx
try { (() => {
function Tabs({
  items = [],
  value,
  defaultValue,
  onChange,
  variant = 'underline',
  style
}) {
  const [i, setI] = React.useState(defaultValue ?? (items[0] && (items[0].value ?? items[0])));
  const cur = value ?? i;
  const pick = v => {
    setI(v);
    onChange && onChange(v);
  };
  if (variant === 'segmented') return /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'inline-flex',
      padding: 4,
      gap: 4,
      borderRadius: 'var(--radius-md)',
      background: 'var(--surface-subtle)',
      ...style
    }
  }, items.map(it => {
    const v = it.value ?? it,
      l = it.label ?? it,
      on = v === cur;
    return /*#__PURE__*/React.createElement("button", {
      key: v,
      onClick: () => pick(v),
      style: {
        border: 'none',
        cursor: 'pointer',
        padding: '6px 14px',
        borderRadius: 6,
        font: '700 14px/1.4 var(--font-sans)',
        background: on ? 'var(--white)' : 'transparent',
        color: on ? 'var(--text-primary)' : 'var(--text-tertiary)',
        boxShadow: on ? '0 1px 3px rgba(0,0,0,0.08)' : 'none',
        transition: 'all var(--dur-fast)'
      }
    }, l);
  }));
  return /*#__PURE__*/React.createElement("div", {
    role: "tablist",
    style: {
      display: 'flex',
      gap: 24,
      borderBottom: '1px solid var(--divider)',
      ...style
    }
  }, items.map(it => {
    const v = it.value ?? it,
      l = it.label ?? it,
      on = v === cur;
    return /*#__PURE__*/React.createElement("button", {
      key: v,
      role: "tab",
      onClick: () => pick(v),
      style: {
        border: 'none',
        background: 'none',
        cursor: 'pointer',
        padding: '12px 0',
        marginBottom: -1,
        font: '700 16px/1.4 var(--font-sans)',
        color: on ? 'var(--text-primary)' : 'var(--text-tertiary)',
        borderBottom: '2px solid ' + (on ? 'var(--gray-900)' : 'transparent'),
        display: 'flex',
        alignItems: 'center',
        gap: 6,
        transition: 'color var(--dur-fast)'
      }
    }, l, it.count != null && /*#__PURE__*/React.createElement("span", {
      style: {
        font: '400 14px/1 var(--font-sans)',
        color: 'var(--text-tertiary)'
      }
    }, it.count));
  }));
}
Object.assign(__ds_scope, { Tabs });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/navigation/Tabs.jsx", error: String((e && e.message) || e) }); }

// ui_kits/line-watch/AlertsScreen.jsx
try { (() => {
const {
  Card,
  Switch,
  Button,
  Dialog,
  Input,
  Select,
  Checkbox,
  Toast,
  IconButton,
  Tooltip
} = window.LINEWatchDesignSystem_35397f;
function AlertsScreen({
  toast
}) {
  const [alerts, setAlerts] = React.useState(window.LW_DATA.alerts);
  const [open, setOpen] = React.useState(false);
  const [name, setName] = React.useState('');
  const save = () => {
    setAlerts([...alerts, {
      id: Date.now(),
      name: name || 'New alert',
      query: '"harbour plan" AND council',
      channel: 'Email',
      on: true,
      last: 'Not triggered yet'
    }]);
    setOpen(false);
    setName('');
    toast('Alert created');
  };
  return /*#__PURE__*/React.createElement("div", {
    style: {
      padding: 32,
      display: 'flex',
      flexDirection: 'column',
      gap: 16,
      maxWidth: 960
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      font: 'var(--type-subtext)',
      color: 'var(--text-tertiary)'
    }
  }, alerts.filter(a => a.on).length, " active \xB7 ", alerts.length, " total"), /*#__PURE__*/React.createElement(Button, {
    icon: "plus",
    onClick: () => setOpen(true)
  }, "New alert")), /*#__PURE__*/React.createElement(Card, {
    padding: 0,
    style: {
      gap: 0,
      overflow: 'hidden'
    }
  }, alerts.map((a, i) => /*#__PURE__*/React.createElement("div", {
    key: a.id,
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: 16,
      padding: '16px 20px',
      borderBottom: i < alerts.length - 1 ? '1px solid var(--divider)' : 'none'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      flex: 1,
      minWidth: 0,
      display: 'flex',
      flexDirection: 'column',
      gap: 4
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      font: 'var(--type-body-bold)',
      color: a.on ? 'var(--text-primary)' : 'var(--text-tertiary)'
    }
  }, a.name), /*#__PURE__*/React.createElement("code", {
    style: {
      font: '400 13px/1.5 ui-monospace,SFMono-Regular,Menlo,monospace',
      color: 'var(--text-secondary)',
      background: 'var(--surface-subtle)',
      padding: '2px 8px',
      borderRadius: 4,
      alignSelf: 'flex-start'
    }
  }, a.query), /*#__PURE__*/React.createElement("div", {
    style: {
      font: 'var(--type-caption)',
      color: 'var(--text-tertiary)'
    }
  }, a.channel, " \xB7 ", a.last)), /*#__PURE__*/React.createElement(Tooltip, {
    content: "Edit alert"
  }, /*#__PURE__*/React.createElement(IconButton, {
    icon: "pencil",
    label: "Edit",
    size: "sm"
  })), /*#__PURE__*/React.createElement(Switch, {
    checked: a.on,
    onChange: v => setAlerts(alerts.map(x => x.id === a.id ? {
      ...x,
      on: v
    } : x))
  })))), /*#__PURE__*/React.createElement(Dialog, {
    open: open,
    title: "New alert",
    onClose: () => setOpen(false),
    width: 480,
    actions: /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement(Button, {
      variant: "secondary",
      onClick: () => setOpen(false)
    }, "Cancel"), /*#__PURE__*/React.createElement(Button, {
      onClick: save
    }, "Create alert"))
  }, /*#__PURE__*/React.createElement(Input, {
    label: "Name",
    placeholder: "e.g. Council vote coverage",
    value: name,
    onChange: e => setName(e.target.value)
  }), /*#__PURE__*/React.createElement(Input, {
    label: "Keywords",
    defaultValue: "\"harbour plan\" AND council",
    helper: "Use AND, OR, NOT and quotes for exact phrases."
  }), /*#__PURE__*/React.createElement(Select, {
    label: "Notify when",
    options: ['Any new mention', 'Negative mentions only', 'Volume spikes 2× or more']
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      gap: 24
    }
  }, /*#__PURE__*/React.createElement(Checkbox, {
    label: "Email",
    defaultChecked: true
  }), /*#__PURE__*/React.createElement(Checkbox, {
    label: "LINE message"
  }))));
}
window.AlertsScreen = AlertsScreen;
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/line-watch/AlertsScreen.jsx", error: String((e && e.message) || e) }); }

// ui_kits/line-watch/FeedScreen.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
const {
  Tabs,
  Tag,
  MentionItem,
  Checkbox,
  Button
} = window.LINEWatchDesignSystem_35397f;
function FeedScreen({
  onOpen,
  selected
}) {
  const D = window.LW_DATA;
  const [tab, setTab] = React.useState('all');
  const [sent, setSent] = React.useState(null);
  const [kw, setKw] = React.useState(['"port expansion"', 'harbour plan']);
  const map = {
    online: 'Online news',
    print: 'Print',
    bc: 'Broadcast',
    social: 'X'
  };
  const list = D.mentions.filter(m => (tab === 'all' || m.medium === map[tab]) && (!sent || m.sentiment === sent));
  return /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      minHeight: '100%'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      flex: 1,
      minWidth: 0,
      display: 'flex',
      flexDirection: 'column'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      padding: '8px 32px 0',
      background: 'var(--white)'
    }
  }, /*#__PURE__*/React.createElement(Tabs, {
    value: tab,
    onChange: setTab,
    items: [{
      value: 'all',
      label: 'All',
      count: 1092
    }, {
      value: 'online',
      label: 'Online',
      count: 642
    }, {
      value: 'print',
      label: 'Print',
      count: 118
    }, {
      value: 'bc',
      label: 'Broadcast',
      count: 96
    }, {
      value: 'social',
      label: 'Social',
      count: 236
    }]
  })), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      gap: 8,
      padding: '16px 32px',
      flexWrap: 'wrap',
      alignItems: 'center'
    }
  }, kw.map(k => /*#__PURE__*/React.createElement(Tag, {
    key: k,
    onRemove: () => setKw(kw.filter(x => x !== k))
  }, k)), /*#__PURE__*/React.createElement("span", {
    style: {
      width: 1,
      height: 20,
      background: 'var(--divider)',
      margin: '0 4px'
    }
  }), ['positive', 'neutral', 'mixed', 'negative'].map(s => /*#__PURE__*/React.createElement(Tag, {
    key: s,
    tone: sent === s ? 'neutral' : 'outline',
    selected: sent === s,
    dot: true,
    onClick: () => setSent(sent === s ? null : s)
  }, s[0].toUpperCase() + s.slice(1)))), /*#__PURE__*/React.createElement("div", {
    style: {
      margin: '0 32px 32px',
      border: '1px solid var(--divider)',
      borderRadius: 'var(--radius-xl)',
      overflow: 'hidden',
      background: 'var(--white)'
    }
  }, list.length ? list.map((m, i) => /*#__PURE__*/React.createElement(MentionItem, _extends({
    key: m.id
  }, m, {
    selected: selected && selected.id === m.id,
    onClick: () => onOpen(m),
    style: i === list.length - 1 ? {
      borderBottom: 'none'
    } : {}
  }))) : /*#__PURE__*/React.createElement("div", {
    style: {
      padding: 48,
      textAlign: 'center',
      font: 'var(--type-body)',
      color: 'var(--text-tertiary)'
    }
  }, "No mentions match these filters."))), /*#__PURE__*/React.createElement("aside", {
    style: {
      width: 260,
      flex: 'none',
      padding: '24px 24px',
      borderLeft: '1px solid var(--divider)',
      display: 'flex',
      flexDirection: 'column',
      gap: 20,
      background: 'var(--white)'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      font: 'var(--type-headline)'
    }
  }, "Filters"), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      flexDirection: 'column',
      gap: 12
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      font: '700 14px/1.4 var(--font-sans)',
      color: 'var(--text-secondary)'
    }
  }, "Language"), /*#__PURE__*/React.createElement(Checkbox, {
    label: "Japanese",
    defaultChecked: true
  }), /*#__PURE__*/React.createElement(Checkbox, {
    label: "English",
    defaultChecked: true
  }), /*#__PURE__*/React.createElement(Checkbox, {
    label: "Korean"
  })), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      flexDirection: 'column',
      gap: 12
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      font: '700 14px/1.4 var(--font-sans)',
      color: 'var(--text-secondary)'
    }
  }, "Reach"), /*#__PURE__*/React.createElement(Checkbox, {
    label: "Over 1M"
  }), /*#__PURE__*/React.createElement(Checkbox, {
    label: "100K \u2013 1M",
    defaultChecked: true
  }), /*#__PURE__*/React.createElement(Checkbox, {
    label: "Under 100K",
    defaultChecked: true
  })), /*#__PURE__*/React.createElement(Button, {
    variant: "secondary",
    fullWidth: true,
    icon: "download"
  }, "Export CSV")));
}
window.FeedScreen = FeedScreen;
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/line-watch/FeedScreen.jsx", error: String((e && e.message) || e) }); }

// ui_kits/line-watch/MentionDrawer.jsx
try { (() => {
const {
  IconButton,
  Tag,
  Avatar,
  Button,
  SentimentBar
} = window.LINEWatchDesignSystem_35397f;
function MentionDrawer({
  m,
  onClose
}) {
  if (!m) return null;
  return /*#__PURE__*/React.createElement("div", {
    onClick: onClose,
    style: {
      position: 'fixed',
      inset: 0,
      background: 'var(--overlay-dim)',
      zIndex: 50,
      display: 'flex',
      justifyContent: 'flex-end'
    }
  }, /*#__PURE__*/React.createElement("div", {
    onClick: e => e.stopPropagation(),
    style: {
      width: 480,
      height: '100%',
      background: 'var(--white)',
      boxShadow: 'var(--shadow-modal)',
      display: 'flex',
      flexDirection: 'column'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: 12,
      padding: '16px 20px',
      borderBottom: '1px solid var(--divider)'
    }
  }, /*#__PURE__*/React.createElement(Avatar, {
    name: m.source,
    size: 40,
    square: true
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      flex: 1
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      font: 'var(--type-body-bold)'
    }
  }, m.source), /*#__PURE__*/React.createElement("div", {
    style: {
      font: 'var(--type-caption)',
      color: 'var(--text-tertiary)'
    }
  }, m.medium, " \xB7 ", m.time, " \xB7 ", m.reach, " reach")), /*#__PURE__*/React.createElement(IconButton, {
    icon: "x",
    label: "Close",
    onClick: onClose
  })), /*#__PURE__*/React.createElement("div", {
    style: {
      padding: 24,
      display: 'flex',
      flexDirection: 'column',
      gap: 20,
      overflow: 'auto',
      flex: 1
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      font: 'var(--type-title2)',
      textWrap: 'pretty'
    }
  }, m.headline), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      gap: 8
    }
  }, /*#__PURE__*/React.createElement(Tag, {
    tone: m.sentiment,
    dot: true
  }, m.sentiment[0].toUpperCase() + m.sentiment.slice(1)), /*#__PURE__*/React.createElement(Tag, {
    tone: "outline",
    icon: "waypoints"
  }, m.narrative)), /*#__PURE__*/React.createElement("div", {
    style: {
      font: 'var(--type-body)',
      color: 'var(--text-secondary)'
    }
  }, m.excerpt), /*#__PURE__*/React.createElement("div", {
    style: {
      padding: 16,
      borderRadius: 'var(--radius-lg)',
      background: 'var(--surface-subtle)',
      display: 'flex',
      flexDirection: 'column',
      gap: 10
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      font: '700 14px/1.4 var(--font-sans)'
    }
  }, "Sentence-level tone"), /*#__PURE__*/React.createElement(SentimentBar, {
    positive: 2,
    neutral: 9,
    mixed: 1,
    negative: 5
  }))), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      gap: 8,
      padding: '16px 20px',
      borderTop: '1px solid var(--divider)'
    }
  }, /*#__PURE__*/React.createElement(Button, {
    variant: "secondary",
    icon: "external-link",
    style: {
      flex: 1
    }
  }, "Open source"), /*#__PURE__*/React.createElement(Button, {
    icon: "file-plus",
    style: {
      flex: 1
    }
  }, "Add to report"))));
}
window.MentionDrawer = MentionDrawer;
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/line-watch/MentionDrawer.jsx", error: String((e && e.message) || e) }); }

// ui_kits/line-watch/NarrativesScreen.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
const {
  Card,
  SentimentBar,
  Tag,
  Button,
  Avatar,
  Icon,
  Tabs
} = window.LINEWatchDesignSystem_35397f;
function NarrativesScreen({
  onNav
}) {
  const D = window.LW_DATA;
  const [sel, setSel] = React.useState('env');
  const n = D.narratives.find(x => x.id === sel);
  return /*#__PURE__*/React.createElement("div", {
    style: {
      padding: 32,
      display: 'grid',
      gridTemplateColumns: '360px minmax(0,1fr)',
      gap: 24,
      alignItems: 'start'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      flexDirection: 'column',
      gap: 12
    }
  }, D.narratives.map(x => {
    const on = x.id === sel;
    return /*#__PURE__*/React.createElement("div", {
      key: x.id,
      onClick: () => setSel(x.id),
      style: {
        padding: 16,
        borderRadius: 'var(--radius-xl)',
        border: '1px solid ' + (on ? 'var(--line-green)' : 'var(--divider)'),
        background: on ? 'var(--surface-selected)' : 'var(--white)',
        cursor: 'pointer',
        display: 'flex',
        flexDirection: 'column',
        gap: 10,
        transition: 'all var(--dur-fast)'
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center'
      }
    }, /*#__PURE__*/React.createElement("span", {
      style: {
        font: 'var(--type-body-bold)'
      }
    }, x.name), /*#__PURE__*/React.createElement("span", {
      style: {
        display: 'flex',
        alignItems: 'center',
        gap: 2,
        font: '700 12px/1 var(--font-sans)',
        color: x.trend > 0 ? 'var(--red-500)' : 'var(--text-tertiary)'
      }
    }, /*#__PURE__*/React.createElement(Icon, {
      name: x.trend > 0 ? 'arrow-up-right' : 'arrow-down-right',
      size: 14
    }), Math.abs(x.trend), "%")), /*#__PURE__*/React.createElement(SentimentBar, _extends({}, x.sentiment, {
      height: 6,
      showLegend: false
    })), /*#__PURE__*/React.createElement("div", {
      style: {
        font: 'var(--type-caption)',
        color: 'var(--text-tertiary)'
      }
    }, x.mentions, " mentions \xB7 ", x.share, "% share of voice"));
  })), /*#__PURE__*/React.createElement(Card, {
    padding: 28,
    style: {
      gap: 24
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'flex-start',
      gap: 16
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      flex: 1
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      font: 'var(--type-caption)',
      color: 'var(--text-tertiary)',
      marginBottom: 4
    }
  }, "Narrative"), /*#__PURE__*/React.createElement("div", {
    style: {
      font: 'var(--type-title1)'
    }
  }, n.name)), /*#__PURE__*/React.createElement(Button, {
    variant: "secondary",
    icon: "bell-plus"
  }, "Create alert"), /*#__PURE__*/React.createElement(Button, {
    icon: "file-text"
  }, "Add to report")), /*#__PURE__*/React.createElement("div", {
    style: {
      font: 'var(--type-body)',
      color: 'var(--text-secondary)',
      textWrap: 'pretty',
      maxWidth: 640
    }
  }, n.summary), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'grid',
      gridTemplateColumns: 'repeat(3,1fr)',
      gap: 16
    }
  }, [['Mentions', n.mentions], ['Share of voice', n.share + '%'], ['Change', (n.trend > 0 ? '+' : '') + n.trend + '%']].map(([l, v]) => /*#__PURE__*/React.createElement("div", {
    key: l,
    style: {
      padding: 16,
      borderRadius: 'var(--radius-lg)',
      background: 'var(--surface-subtle)'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      font: 'var(--type-caption)',
      color: 'var(--text-tertiary)'
    }
  }, l), /*#__PURE__*/React.createElement("div", {
    style: {
      font: '800 24px/1.4 var(--font-sans)',
      fontVariantNumeric: 'tabular-nums'
    }
  }, v)))), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      flexDirection: 'column',
      gap: 12
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      font: 'var(--type-headline)'
    }
  }, "Tone"), /*#__PURE__*/React.createElement(SentimentBar, _extends({}, n.sentiment, {
    height: 12
  }))), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      flexDirection: 'column',
      gap: 12
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      font: 'var(--type-headline)'
    }
  }, "Leading voices"), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      gap: 12,
      flexWrap: 'wrap'
    }
  }, n.voices.map(v => /*#__PURE__*/React.createElement("div", {
    key: v,
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: 10,
      padding: '8px 14px 8px 8px',
      border: '1px solid var(--divider)',
      borderRadius: 999
    }
  }, /*#__PURE__*/React.createElement(Avatar, {
    name: v,
    size: 32
  }), /*#__PURE__*/React.createElement("span", {
    style: {
      font: '700 14px/1 var(--font-sans)'
    }
  }, v))))), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      flexDirection: 'column',
      gap: 12
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      font: 'var(--type-headline)'
    }
  }, "Key phrases"), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      gap: 8,
      flexWrap: 'wrap'
    }
  }, ['water quality', 'dredging', 'fishing cooperative', 'independent review', 'coastal habitat', '2019 draft'].map(k => /*#__PURE__*/React.createElement(Tag, {
    key: k,
    tone: "outline"
  }, k)))), /*#__PURE__*/React.createElement(Button, {
    variant: "link",
    iconRight: "chevron-right",
    style: {
      alignSelf: 'flex-start',
      padding: 0
    },
    onClick: () => onNav('feed')
  }, "View ", n.mentions, " mentions in feed")));
}
window.NarrativesScreen = NarrativesScreen;
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/line-watch/NarrativesScreen.jsx", error: String((e && e.message) || e) }); }

// ui_kits/line-watch/OverviewScreen.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
const {
  StatTile,
  Card,
  Button,
  SentimentBar,
  ListRow,
  Banner,
  Tag,
  MentionItem
} = window.LINEWatchDesignSystem_35397f;
function OverviewScreen({
  onNav,
  onOpen
}) {
  const D = window.LW_DATA;
  return /*#__PURE__*/React.createElement("div", {
    style: {
      padding: 32,
      display: 'flex',
      flexDirection: 'column',
      gap: 24
    }
  }, /*#__PURE__*/React.createElement(Banner, {
    tone: "warning",
    title: "Mention spike detected",
    action: /*#__PURE__*/React.createElement(Button, {
      size: "sm",
      variant: "secondary",
      onClick: () => onNav('narratives')
    }, "See narrative")
  }, "Negative coverage of \u201CEnvironmental impact\u201D is up 3\xD7 in the last hour."), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'grid',
      gridTemplateColumns: 'repeat(4,minmax(0,1fr))',
      gap: 16
    }
  }, /*#__PURE__*/React.createElement(StatTile, {
    label: "Mentions",
    icon: "newspaper",
    value: "1,092",
    delta: 18,
    deltaLabel: "vs prior period"
  }), /*#__PURE__*/React.createElement(StatTile, {
    label: "Negative share",
    icon: "trending-down",
    value: "28%",
    delta: 9,
    invert: true,
    deltaLabel: "vs prior period"
  }), /*#__PURE__*/React.createElement(StatTile, {
    label: "Est. reach",
    icon: "eye",
    value: "18.6M",
    delta: -4,
    deltaLabel: "vs prior period"
  }), /*#__PURE__*/React.createElement(StatTile, {
    label: "Active narratives",
    icon: "waypoints",
    value: "4",
    delta: 0,
    deltaLabel: "no change"
  })), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'grid',
      gridTemplateColumns: 'minmax(0,2fr) minmax(0,1fr)',
      gap: 16
    }
  }, /*#__PURE__*/React.createElement(Card, {
    title: "Mention volume",
    subtitle: "Daily mentions, all sources"
  }, /*#__PURE__*/React.createElement(VolumeChart, {
    data: D.volume
  })), /*#__PURE__*/React.createElement(Card, {
    title: "Sentiment",
    subtitle: "1,092 mentions"
  }, /*#__PURE__*/React.createElement(SentimentBar, {
    positive: 212,
    neutral: 432,
    mixed: 138,
    negative: 310,
    height: 12
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      flexDirection: 'column',
      gap: 10,
      marginTop: 4
    }
  }, D.narratives.slice(0, 3).map(n => /*#__PURE__*/React.createElement("div", {
    key: n.id,
    onClick: () => onNav('narratives'),
    style: {
      cursor: 'pointer',
      display: 'flex',
      flexDirection: 'column',
      gap: 6
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      justifyContent: 'space-between',
      font: '700 14px/1.4 var(--font-sans)'
    }
  }, /*#__PURE__*/React.createElement("span", null, n.name), /*#__PURE__*/React.createElement("span", {
    style: {
      color: 'var(--text-tertiary)',
      fontWeight: 400
    }
  }, n.share, "%")), /*#__PURE__*/React.createElement(SentimentBar, _extends({}, n.sentiment, {
    height: 6,
    showLegend: false
  }))))))), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'grid',
      gridTemplateColumns: 'minmax(0,2fr) minmax(0,1fr)',
      gap: 16
    }
  }, /*#__PURE__*/React.createElement(Card, {
    title: "Latest mentions",
    padding: 0,
    style: {
      paddingTop: 20,
      gap: 8
    },
    action: /*#__PURE__*/React.createElement(Button, {
      variant: "tertiary",
      size: "sm",
      style: {
        marginRight: 12
      },
      onClick: () => onNav('feed')
    }, "View feed")
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      paddingLeft: 0
    }
  }, D.mentions.slice(0, 3).map((m, i) => /*#__PURE__*/React.createElement(MentionItem, _extends({
    key: m.id
  }, m, {
    onClick: () => onOpen(m),
    style: i === 2 ? {
      borderBottom: 'none',
      borderRadius: '0 0 16px 16px'
    } : {}
  }))))), /*#__PURE__*/React.createElement(Card, {
    title: "Top sources",
    padding: 0,
    style: {
      paddingTop: 20,
      gap: 4
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      paddingLeft: 0
    }
  }, D.sources.map((s, i) => /*#__PURE__*/React.createElement(ListRow, {
    key: s.name,
    avatar: {
      name: s.name,
      size: 40,
      square: true
    },
    title: s.name,
    subtitle: s.s,
    meta: s.n + ' mentions',
    divider: i < D.sources.length - 1,
    style: {
      borderRadius: i === D.sources.length - 1 ? '0 0 16px 16px' : 0
    }
  }))))));
}
window.OverviewScreen = OverviewScreen;
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/line-watch/OverviewScreen.jsx", error: String((e && e.message) || e) }); }

// ui_kits/line-watch/Sidebar.jsx
try { (() => {
const {
  Icon,
  Badge
} = window.LINEWatchDesignSystem_35397f;
function Sidebar({
  route,
  onNav
}) {
  const items = [['overview', 'layout-dashboard', 'Overview'], ['feed', 'newspaper', 'Media feed', 24], ['narratives', 'waypoints', 'Narratives'], ['alerts', 'bell', 'Alerts', 1], ['reports', 'file-text', 'Reports']];
  return /*#__PURE__*/React.createElement("aside", {
    style: {
      width: 240,
      flex: 'none',
      borderRight: '1px solid var(--divider)',
      display: 'flex',
      flexDirection: 'column',
      padding: '20px 12px',
      gap: 4,
      background: 'var(--white)'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      font: '800 22px/1 var(--font-sans)',
      letterSpacing: '-0.3px',
      padding: '4px 12px 24px'
    }
  }, "LINE ", /*#__PURE__*/React.createElement("span", {
    style: {
      color: 'var(--line-green)'
    }
  }, "Watch")), items.map(([k, ic, l, b]) => {
    const on = route === k;
    return /*#__PURE__*/React.createElement("button", {
      key: k,
      onClick: () => onNav(k),
      style: {
        display: 'flex',
        alignItems: 'center',
        gap: 12,
        padding: '10px 12px',
        border: 'none',
        borderRadius: 'var(--radius-md)',
        background: on ? 'var(--surface-selected)' : 'transparent',
        color: on ? '#05A648' : 'var(--text-secondary)',
        font: '700 15px/1.4 var(--font-sans)',
        cursor: 'pointer',
        textAlign: 'left'
      }
    }, /*#__PURE__*/React.createElement(Icon, {
      name: ic,
      size: 20
    }), /*#__PURE__*/React.createElement("span", {
      style: {
        flex: 1,
        color: on ? 'var(--text-primary)' : undefined
      }
    }, l), b && /*#__PURE__*/React.createElement(Badge, {
      count: b,
      variant: k === 'alerts' ? 'notification' : 'neutral'
    }));
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      flex: 1
    }
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      padding: 12,
      borderRadius: 'var(--radius-lg)',
      background: 'var(--surface-subtle)',
      display: 'flex',
      flexDirection: 'column',
      gap: 4
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      font: 'var(--type-caption)',
      color: 'var(--text-tertiary)'
    }
  }, "Workspace"), /*#__PURE__*/React.createElement("div", {
    style: {
      font: '700 14px/1.4 var(--font-sans)'
    }
  }, "Harbour Project"), /*#__PURE__*/React.createElement("div", {
    style: {
      font: 'var(--type-caption)',
      color: 'var(--text-tertiary)'
    }
  }, "4 keywords \xB7 214 sources")));
}
window.Sidebar = Sidebar;
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/line-watch/Sidebar.jsx", error: String((e && e.message) || e) }); }

// ui_kits/line-watch/TopBar.jsx
try { (() => {
const {
  Input,
  Select,
  IconButton,
  Avatar
} = window.LINEWatchDesignSystem_35397f;
function TopBar({
  title,
  subtitle,
  actions
}) {
  return /*#__PURE__*/React.createElement("header", {
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: 16,
      padding: '16px 32px',
      borderBottom: '1px solid var(--divider)',
      background: 'var(--white)',
      position: 'sticky',
      top: 0,
      zIndex: 5
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      flex: 1,
      minWidth: 0
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      font: 'var(--type-title1)'
    }
  }, title), subtitle && /*#__PURE__*/React.createElement("div", {
    style: {
      font: 'var(--type-subtext)',
      color: 'var(--text-tertiary)'
    }
  }, subtitle)), /*#__PURE__*/React.createElement(Input, {
    icon: "search",
    placeholder: "Search mentions",
    size: "sm",
    style: {
      width: 260
    }
  }), /*#__PURE__*/React.createElement(Select, {
    size: "sm",
    options: ['Last 14 days', 'Last 24 hours', 'Last 7 days', 'Last 30 days'],
    style: {
      width: 150
    }
  }), actions, /*#__PURE__*/React.createElement(IconButton, {
    icon: "bell",
    label: "Notifications",
    badge: 1
  }), /*#__PURE__*/React.createElement(Avatar, {
    name: "Mika Sato",
    size: 36
  }));
}
window.TopBar = TopBar;
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/line-watch/TopBar.jsx", error: String((e && e.message) || e) }); }

// ui_kits/line-watch/VolumeChart.jsx
try { (() => {
function VolumeChart({
  data,
  height = 180
}) {
  const w = 600,
    max = Math.max(...data) * 1.15,
    step = w / (data.length - 1);
  const pts = data.map((v, i) => [i * step, height - v / max * height]);
  const line = pts.map(p => p.join(',')).join(' ');
  const area = '0,' + height + ' ' + line + ' ' + w + ',' + height;
  const days = ['Apr 1', '', '', 'Apr 4', '', '', 'Apr 7', '', '', 'Apr 10', '', '', 'Apr 13', ''];
  return /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      flexDirection: 'column',
      gap: 8
    }
  }, /*#__PURE__*/React.createElement("svg", {
    viewBox: '0 0 ' + w + ' ' + height,
    preserveAspectRatio: "none",
    style: {
      width: '100%',
      height
    }
  }, [0.25, 0.5, 0.75].map(f => /*#__PURE__*/React.createElement("line", {
    key: f,
    x1: "0",
    x2: w,
    y1: height * f,
    y2: height * f,
    stroke: "var(--gray-200)",
    strokeWidth: "1",
    vectorEffect: "non-scaling-stroke"
  })), /*#__PURE__*/React.createElement("polygon", {
    points: area,
    fill: "var(--line-green)",
    opacity: "0.1"
  }), /*#__PURE__*/React.createElement("polyline", {
    points: line,
    fill: "none",
    stroke: "var(--line-green)",
    strokeWidth: "2.5",
    vectorEffect: "non-scaling-stroke",
    strokeLinejoin: "round"
  })), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      justifyContent: 'space-between',
      font: 'var(--type-caption)',
      color: 'var(--text-tertiary)'
    }
  }, days.map((d, i) => /*#__PURE__*/React.createElement("span", {
    key: i
  }, d))));
}
window.VolumeChart = VolumeChart;
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/line-watch/VolumeChart.jsx", error: String((e && e.message) || e) }); }

// ui_kits/line-watch/data.js
try { (() => {
window.LW_DATA = {
  mentions: [{
    id: 1,
    source: 'Kyodo News',
    medium: 'Online news',
    time: '12 min ago',
    headline: 'Port expansion draws criticism from coastal residents',
    excerpt: 'Residents at Tuesday\'s public hearing raised concerns about dredging and truck traffic, while city officials pointed to an estimated 1,200 new jobs.',
    sentiment: 'negative',
    narrative: 'Environmental impact',
    reach: '1.2M'
  }, {
    id: 2,
    source: 'Nikkei Asia',
    medium: 'Online news',
    time: '48 min ago',
    headline: 'Logistics firms back port plan as capacity squeeze worsens',
    excerpt: 'Three of the region\'s largest carriers issued a joint statement supporting the expansion, citing rising container wait times.',
    sentiment: 'positive',
    narrative: 'Economic growth',
    reach: '860K'
  }, {
    id: 3,
    source: 'NHK',
    medium: 'Broadcast',
    time: '1h ago',
    headline: 'Evening bulletin: council vote on harbour plan delayed to May',
    excerpt: 'The council postponed its vote after receiving more than 4,000 public comments in the final week of consultation.',
    sentiment: 'neutral',
    narrative: 'Process & governance',
    reach: '3.4M'
  }, {
    id: 4,
    source: '@harbourwatch',
    medium: 'X',
    time: '2h ago',
    headline: 'Thread: what the environmental assessment leaves out',
    excerpt: 'A 14-post thread comparing the assessment to the 2019 draft has been reshared 2,300 times.',
    sentiment: 'negative',
    narrative: 'Environmental impact',
    reach: '410K'
  }, {
    id: 5,
    source: 'Asahi Shimbun',
    medium: 'Print',
    time: '3h ago',
    headline: 'Editorial: the port debate needs better numbers on both sides',
    excerpt: 'Both supporters and critics are relying on projections that have not been independently reviewed.',
    sentiment: 'mixed',
    narrative: 'Process & governance',
    reach: '5.1M'
  }, {
    id: 6,
    source: 'Japan Times',
    medium: 'Online news',
    time: '5h ago',
    headline: 'Local fishing cooperative requests independent review',
    excerpt: 'The cooperative says it is not opposed to the project but wants clearer data on water quality.',
    sentiment: 'mixed',
    narrative: 'Environmental impact',
    reach: '290K'
  }],
  narratives: [{
    id: 'env',
    name: 'Environmental impact',
    summary: 'Coverage frames the expansion as a risk to water quality and coastal habitats, led by residents and the fishing cooperative.',
    mentions: 412,
    share: 38,
    trend: +42,
    sentiment: {
      positive: 12,
      neutral: 120,
      mixed: 64,
      negative: 216
    },
    voices: ['Kyodo News', '@harbourwatch', 'Japan Times']
  }, {
    id: 'eco',
    name: 'Economic growth',
    summary: 'Business press emphasises jobs, shipping capacity and regional competitiveness against neighbouring ports.',
    mentions: 318,
    share: 29,
    trend: +8,
    sentiment: {
      positive: 188,
      neutral: 104,
      mixed: 14,
      negative: 12
    },
    voices: ['Nikkei Asia', 'Bloomberg', 'Logistics Today']
  }, {
    id: 'gov',
    name: 'Process & governance',
    summary: 'Neutral-to-critical reporting on consultation timelines, the delayed council vote and data transparency.',
    mentions: 244,
    share: 22,
    trend: -5,
    sentiment: {
      positive: 10,
      neutral: 160,
      mixed: 48,
      negative: 26
    },
    voices: ['NHK', 'Asahi Shimbun', 'Mainichi']
  }, {
    id: 'traffic',
    name: 'Traffic & noise',
    summary: 'Smaller, locally focused stories about truck routes and night-time construction noise.',
    mentions: 118,
    share: 11,
    trend: +15,
    sentiment: {
      positive: 2,
      neutral: 48,
      mixed: 12,
      negative: 56
    },
    voices: ['Kanagawa Shimbun', 'Town FM']
  }],
  volume: [42, 38, 51, 47, 60, 55, 72, 68, 81, 77, 95, 140, 168, 152],
  sources: [{
    name: 'Kyodo News',
    n: 42,
    s: 'mostly neutral'
  }, {
    name: 'Nikkei Asia',
    n: 31,
    s: 'mostly positive'
  }, {
    name: 'NHK',
    n: 28,
    s: 'neutral'
  }, {
    name: '@harbourwatch',
    n: 24,
    s: 'negative'
  }],
  alerts: [{
    id: 1,
    name: 'Port expansion — negative spike',
    query: '"port expansion" AND (protest OR dredging)',
    channel: 'Email · LINE',
    on: true,
    last: 'Triggered 12 min ago'
  }, {
    id: 2,
    name: 'CEO mentions',
    query: '"Tanaka Hiroshi" OR "CEO Tanaka"',
    channel: 'Email',
    on: true,
    last: 'Triggered yesterday'
  }, {
    id: 3,
    name: 'Competitor launches',
    query: '(Yokohama OR Kobe) AND "new terminal"',
    channel: 'Daily digest',
    on: false,
    last: 'Paused'
  }]
};
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/line-watch/data.js", error: String((e && e.message) || e) }); }

// ui_kits/line-watch/standalone-bundle.js
try { (() => {
/* @ds-bundle: {"format":4,"namespace":"LINEWatchDesignSystem_35397f","components":[{"name":"Button","sourcePath":"components/actions/Button.jsx"},{"name":"IconButton","sourcePath":"components/actions/IconButton.jsx"},{"name":"Avatar","sourcePath":"components/display/Avatar.jsx"},{"name":"Badge","sourcePath":"components/display/Badge.jsx"},{"name":"Card","sourcePath":"components/display/Card.jsx"},{"name":"ListRow","sourcePath":"components/display/ListRow.jsx"},{"name":"Tag","sourcePath":"components/display/Tag.jsx"},{"name":"Banner","sourcePath":"components/feedback/Banner.jsx"},{"name":"Dialog","sourcePath":"components/feedback/Dialog.jsx"},{"name":"Toast","sourcePath":"components/feedback/Toast.jsx"},{"name":"Tooltip","sourcePath":"components/feedback/Tooltip.jsx"},{"name":"Checkbox","sourcePath":"components/forms/Checkbox.jsx"},{"name":"Input","sourcePath":"components/forms/Input.jsx"},{"name":"Select","sourcePath":"components/forms/Select.jsx"},{"name":"Switch","sourcePath":"components/forms/Switch.jsx"},{"name":"Icon","sourcePath":"components/icons/Icon.jsx"},{"name":"MentionItem","sourcePath":"components/monitoring/MentionItem.jsx"},{"name":"SentimentBar","sourcePath":"components/monitoring/SentimentBar.jsx"},{"name":"StatTile","sourcePath":"components/monitoring/StatTile.jsx"},{"name":"Tabs","sourcePath":"components/navigation/Tabs.jsx"}],"sourceHashes":{"components/actions/Button.jsx":"3f6902f3beb6","components/actions/IconButton.jsx":"05b5b1149afd","components/display/Avatar.jsx":"7d2aaa1e834a","components/display/Badge.jsx":"cae1e90b371c","components/display/Card.jsx":"31f62a9e1e72","components/display/ListRow.jsx":"d0e3cf04b7ce","components/display/Tag.jsx":"091d6659f4cb","components/feedback/Banner.jsx":"1b9ea2602390","components/feedback/Dialog.jsx":"c7402677617e","components/feedback/Toast.jsx":"a4eea18ac4b3","components/feedback/Tooltip.jsx":"91da7a9ab34c","components/forms/Checkbox.jsx":"258a9f1a9c59","components/forms/Input.jsx":"a447f64b9e1e","components/forms/Select.jsx":"379e1233796e","components/forms/Switch.jsx":"545f5b7e8ca9","components/icons/Icon.jsx":"07201193e431","components/monitoring/MentionItem.jsx":"734fb4be0d0f","components/monitoring/SentimentBar.jsx":"89cc569dff16","components/monitoring/StatTile.jsx":"b6601336f9c9","components/navigation/Tabs.jsx":"755e2cbc091a","ui_kits/line-watch/AlertsScreen.jsx":"b7b3cec703b1","ui_kits/line-watch/FeedScreen.jsx":"a1fff3f27f43","ui_kits/line-watch/MentionDrawer.jsx":"39d328e4bb31","ui_kits/line-watch/NarrativesScreen.jsx":"b155a760dd33","ui_kits/line-watch/OverviewScreen.jsx":"def42c722335","ui_kits/line-watch/Sidebar.jsx":"510b22b75a5f","ui_kits/line-watch/TopBar.jsx":"1e6b3b0f687a","ui_kits/line-watch/VolumeChart.jsx":"2d5470a495a7","ui_kits/line-watch/data.js":"2f1b03e5263e"},"inlinedExternals":[],"unexposedExports":[]} */

(() => {
  const __ds_ns = window.LINEWatchDesignSystem_35397f = window.LINEWatchDesignSystem_35397f || {};
  const __ds_scope = {};
  __ds_ns.__errors = __ds_ns.__errors || [];

  // components/display/Avatar.jsx
  try {
    (() => {
      function Avatar({
        src,
        name = '',
        size = 48,
        square = false,
        style
      }) {
        const ini = name.split(/\s+/).filter(Boolean).slice(0, 2).map(w => w[0]).join('').toUpperCase();
        return /*#__PURE__*/React.createElement("span", {
          style: {
            width: size,
            height: size,
            flex: 'none',
            borderRadius: square ? 'var(--radius-md)' : '50%',
            background: src ? 'center/cover url(' + src + ')' : 'var(--gray-100)',
            color: 'var(--gray-700)',
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            font: '700 ' + Math.round(size * 0.36) + 'px/1 var(--font-sans)',
            border: '1px solid var(--border-subtle)',
            overflow: 'hidden',
            ...style
          }
        }, !src && ini);
      }
      Object.assign(__ds_scope, {
        Avatar
      });
    })();
  } catch (e) {
    __ds_ns.__errors.push({
      path: "components/display/Avatar.jsx",
      error: String(e && e.message || e)
    });
  }

  // components/display/Badge.jsx
  try {
    (() => {
      function Badge({
        count,
        variant = 'notification',
        dot = false,
        children,
        style
      }) {
        const bg = variant === 'new' ? 'var(--line-green)' : variant === 'neutral' ? 'var(--gray-500)' : 'var(--red-500)';
        if (dot) return /*#__PURE__*/React.createElement("span", {
          style: {
            display: 'inline-block',
            width: 8,
            height: 8,
            borderRadius: '50%',
            background: bg,
            ...style
          }
        });
        return /*#__PURE__*/React.createElement("span", {
          style: {
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            minWidth: 18,
            padding: '2px 6px',
            borderRadius: 'var(--radius-full)',
            background: bg,
            color: '#fff',
            font: 'var(--type-badge)',
            ...style
          }
        }, children ?? (count > 99 ? '99+' : count));
      }
      Object.assign(__ds_scope, {
        Badge
      });
    })();
  } catch (e) {
    __ds_ns.__errors.push({
      path: "components/display/Badge.jsx",
      error: String(e && e.message || e)
    });
  }

  // components/display/Card.jsx
  try {
    (() => {
      function Card({
        title,
        subtitle,
        action,
        padding = 20,
        interactive = false,
        onClick,
        children,
        style
      }) {
        const [h, setH] = React.useState(false);
        return /*#__PURE__*/React.createElement("div", {
          onClick: onClick,
          onMouseEnter: () => setH(true),
          onMouseLeave: () => setH(false),
          style: {
            background: 'var(--surface-card)',
            border: '1px solid var(--border-subtle)',
            borderRadius: 'var(--radius-xl)',
            padding,
            display: 'flex',
            flexDirection: 'column',
            gap: 16,
            cursor: interactive ? 'pointer' : 'default',
            boxShadow: interactive && h ? 'var(--shadow-popover)' : 'none',
            transition: 'box-shadow var(--dur-base) var(--ease-standard)',
            minWidth: 0,
            ...style
          }
        }, (title || action) && /*#__PURE__*/React.createElement("div", {
          style: {
            display: 'flex',
            alignItems: 'flex-start',
            justifyContent: 'space-between',
            gap: 12
          }
        }, /*#__PURE__*/React.createElement("div", {
          style: {
            display: 'flex',
            flexDirection: 'column',
            gap: 2,
            minWidth: 0
          }
        }, title && /*#__PURE__*/React.createElement("div", {
          style: {
            font: 'var(--type-headline)'
          }
        }, title), subtitle && /*#__PURE__*/React.createElement("div", {
          style: {
            font: 'var(--type-subtext)',
            color: 'var(--text-tertiary)'
          }
        }, subtitle)), action), children);
      }
      Object.assign(__ds_scope, {
        Card
      });
    })();
  } catch (e) {
    __ds_ns.__errors.push({
      path: "components/display/Card.jsx",
      error: String(e && e.message || e)
    });
  }

  // components/display/ListRow.jsx
  try {
    (() => {
      function _extends() {
        return _extends = Object.assign ? Object.assign.bind() : function (n) {
          for (var e = 1; e < arguments.length; e++) {
            var t = arguments[e];
            for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]);
          }
          return n;
        }, _extends.apply(null, arguments);
      }
      function ListRow({
        avatar,
        leading,
        title,
        subtitle,
        meta,
        trailing,
        divider = true,
        selected = false,
        onClick,
        style
      }) {
        const [h, setH] = React.useState(false);
        return /*#__PURE__*/React.createElement("div", {
          onClick: onClick,
          onMouseEnter: () => setH(true),
          onMouseLeave: () => setH(false),
          style: {
            display: 'flex',
            alignItems: 'center',
            gap: 12,
            padding: '0 var(--list-pad-x)',
            background: selected ? 'var(--surface-selected)' : h && onClick ? 'var(--overlay-hover)' : 'var(--surface-base)',
            cursor: onClick ? 'pointer' : 'default',
            transition: 'background var(--dur-fast)',
            ...style
          }
        }, leading ?? (avatar !== undefined && /*#__PURE__*/React.createElement(__ds_scope.Avatar, _extends({
          name: typeof avatar === 'string' ? avatar : ''
        }, typeof avatar === 'object' ? avatar : {}))), /*#__PURE__*/React.createElement("div", {
          style: {
            flex: 1,
            minWidth: 0,
            display: 'flex',
            alignItems: 'center',
            gap: 12,
            padding: 'var(--list-pad-y) 0',
            borderBottom: divider ? '1px solid var(--divider)' : 'none'
          }
        }, /*#__PURE__*/React.createElement("div", {
          style: {
            flex: 1,
            minWidth: 0
          }
        }, /*#__PURE__*/React.createElement("div", {
          style: {
            font: 'var(--type-body-bold)',
            color: 'var(--text-primary)',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            whiteSpace: 'nowrap'
          }
        }, title), subtitle && /*#__PURE__*/React.createElement("div", {
          style: {
            font: 'var(--type-subtext)',
            color: 'var(--text-tertiary)',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            whiteSpace: 'nowrap'
          }
        }, subtitle)), (meta || trailing) && /*#__PURE__*/React.createElement("div", {
          style: {
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'flex-end',
            gap: 6,
            flex: 'none'
          }
        }, meta && /*#__PURE__*/React.createElement("span", {
          style: {
            font: 'var(--type-caption)',
            color: 'var(--text-tertiary)'
          }
        }, meta), trailing)));
      }
      Object.assign(__ds_scope, {
        ListRow
      });
    })();
  } catch (e) {
    __ds_ns.__errors.push({
      path: "components/display/ListRow.jsx",
      error: String(e && e.message || e)
    });
  }

  // components/feedback/Tooltip.jsx
  try {
    (() => {
      function Tooltip({
        content,
        placement = 'top',
        open,
        children
      }) {
        const [h, setH] = React.useState(false);
        const show = open ?? h;
        const pos = placement === 'bottom' ? {
          top: 'calc(100% + 8px)'
        } : {
          bottom: 'calc(100% + 8px)'
        };
        return /*#__PURE__*/React.createElement("span", {
          onMouseEnter: () => setH(true),
          onMouseLeave: () => setH(false),
          style: {
            position: 'relative',
            display: 'inline-flex'
          }
        }, children, /*#__PURE__*/React.createElement("span", {
          role: "tooltip",
          style: {
            position: 'absolute',
            left: '50%',
            ...pos,
            transform: 'translateX(-50%) translateY(' + (show ? 0 : 4) + 'px)',
            opacity: show ? 1 : 0,
            pointerEvents: 'none',
            background: 'var(--gray-900)',
            color: '#fff',
            font: 'var(--type-caption)',
            padding: '6px 10px',
            borderRadius: 'var(--radius-md)',
            whiteSpace: 'nowrap',
            boxShadow: 'var(--shadow-popover)',
            transition: 'opacity var(--dur-base), transform var(--dur-base) var(--ease-standard)',
            zIndex: 50
          }
        }, content));
      }
      Object.assign(__ds_scope, {
        Tooltip
      });
    })();
  } catch (e) {
    __ds_ns.__errors.push({
      path: "components/feedback/Tooltip.jsx",
      error: String(e && e.message || e)
    });
  }

  // components/forms/Switch.jsx
  try {
    (() => {
      function Switch({
        checked,
        defaultChecked = false,
        onChange,
        label,
        disabled = false,
        style
      }) {
        const [i, setI] = React.useState(defaultChecked);
        const on = checked ?? i;
        const t = () => {
          if (disabled) return;
          setI(!on);
          onChange && onChange(!on);
        };
        return /*#__PURE__*/React.createElement("label", {
          onClick: t,
          style: {
            display: 'inline-flex',
            alignItems: 'center',
            gap: 12,
            cursor: disabled ? 'not-allowed' : 'pointer',
            font: 'var(--type-body)',
            color: disabled ? 'var(--text-disabled)' : 'var(--text-primary)',
            ...style
          }
        }, /*#__PURE__*/React.createElement("span", {
          style: {
            width: 44,
            height: 26,
            borderRadius: 999,
            flex: 'none',
            position: 'relative',
            background: on ? 'var(--line-green)' : 'var(--gray-300)',
            opacity: disabled ? 0.5 : 1,
            transition: 'background var(--dur-base) var(--ease-standard)'
          }
        }, /*#__PURE__*/React.createElement("span", {
          style: {
            position: 'absolute',
            top: 3,
            left: on ? 21 : 3,
            width: 20,
            height: 20,
            borderRadius: '50%',
            background: '#fff',
            boxShadow: '0 1px 3px rgba(0,0,0,0.2)',
            transition: 'left var(--dur-base) var(--ease-standard)'
          }
        })), label);
      }
      Object.assign(__ds_scope, {
        Switch
      });
    })();
  } catch (e) {
    __ds_ns.__errors.push({
      path: "components/forms/Switch.jsx",
      error: String(e && e.message || e)
    });
  }

  // components/icons/Icon.jsx
  try {
    (() => {
      function _extends() {
        return _extends = Object.assign ? Object.assign.bind() : function (n) {
          for (var e = 1; e < arguments.length; e++) {
            var t = arguments[e];
            for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]);
          }
          return n;
        }, _extends.apply(null, arguments);
      }
      const CDN = 'https://unpkg.com/lucide-static@0.460.0/icons/';
      const LW_ICONS = {
        "layout-dashboard": "data:image/svg+xml;base64,PCEtLSBAbGljZW5zZSBsdWNpZGUtc3RhdGljIHYwLjQ2MC4wIC0gSVNDIC0tPgo8c3ZnCiAgY2xhc3M9Imx1Y2lkZSBsdWNpZGUtbGF5b3V0LWRhc2hib2FyZCIKICB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciCiAgd2lkdGg9IjI0IgogIGhlaWdodD0iMjQiCiAgdmlld0JveD0iMCAwIDI0IDI0IgogIGZpbGw9Im5vbmUiCiAgc3Ryb2tlPSJjdXJyZW50Q29sb3IiCiAgc3Ryb2tlLXdpZHRoPSIyIgogIHN0cm9rZS1saW5lY2FwPSJyb3VuZCIKICBzdHJva2UtbGluZWpvaW49InJvdW5kIgo+CiAgPHJlY3Qgd2lkdGg9IjciIGhlaWdodD0iOSIgeD0iMyIgeT0iMyIgcng9IjEiIC8+CiAgPHJlY3Qgd2lkdGg9IjciIGhlaWdodD0iNSIgeD0iMTQiIHk9IjMiIHJ4PSIxIiAvPgogIDxyZWN0IHdpZHRoPSI3IiBoZWlnaHQ9IjkiIHg9IjE0IiB5PSIxMiIgcng9IjEiIC8+CiAgPHJlY3Qgd2lkdGg9IjciIGhlaWdodD0iNSIgeD0iMyIgeT0iMTYiIHJ4PSIxIiAvPgo8L3N2Zz4K",
        "newspaper": "data:image/svg+xml;base64,PCEtLSBAbGljZW5zZSBsdWNpZGUtc3RhdGljIHYwLjQ2MC4wIC0gSVNDIC0tPgo8c3ZnCiAgY2xhc3M9Imx1Y2lkZSBsdWNpZGUtbmV3c3BhcGVyIgogIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyIKICB3aWR0aD0iMjQiCiAgaGVpZ2h0PSIyNCIKICB2aWV3Qm94PSIwIDAgMjQgMjQiCiAgZmlsbD0ibm9uZSIKICBzdHJva2U9ImN1cnJlbnRDb2xvciIKICBzdHJva2Utd2lkdGg9IjIiCiAgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIgogIHN0cm9rZS1saW5lam9pbj0icm91bmQiCj4KICA8cGF0aCBkPSJNNCAyMmgxNmEyIDIgMCAwIDAgMi0yVjRhMiAyIDAgMCAwLTItMkg4YTIgMiAwIDAgMC0yIDJ2MTZhMiAyIDAgMCAxLTIgMlptMCAwYTIgMiAwIDAgMS0yLTJ2LTljMC0xLjEuOS0yIDItMmgyIiAvPgogIDxwYXRoIGQ9Ik0xOCAxNGgtOCIgLz4KICA8cGF0aCBkPSJNMTUgMThoLTUiIC8+CiAgPHBhdGggZD0iTTEwIDZoOHY0aC04VjZaIiAvPgo8L3N2Zz4K",
        "waypoints": "data:image/svg+xml;base64,PCEtLSBAbGljZW5zZSBsdWNpZGUtc3RhdGljIHYwLjQ2MC4wIC0gSVNDIC0tPgo8c3ZnCiAgY2xhc3M9Imx1Y2lkZSBsdWNpZGUtd2F5cG9pbnRzIgogIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyIKICB3aWR0aD0iMjQiCiAgaGVpZ2h0PSIyNCIKICB2aWV3Qm94PSIwIDAgMjQgMjQiCiAgZmlsbD0ibm9uZSIKICBzdHJva2U9ImN1cnJlbnRDb2xvciIKICBzdHJva2Utd2lkdGg9IjIiCiAgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIgogIHN0cm9rZS1saW5lam9pbj0icm91bmQiCj4KICA8Y2lyY2xlIGN4PSIxMiIgY3k9IjQuNSIgcj0iMi41IiAvPgogIDxwYXRoIGQ9Im0xMC4yIDYuMy0zLjkgMy45IiAvPgogIDxjaXJjbGUgY3g9IjQuNSIgY3k9IjEyIiByPSIyLjUiIC8+CiAgPHBhdGggZD0iTTcgMTJoMTAiIC8+CiAgPGNpcmNsZSBjeD0iMTkuNSIgY3k9IjEyIiByPSIyLjUiIC8+CiAgPHBhdGggZD0ibTEzLjggMTcuNyAzLjktMy45IiAvPgogIDxjaXJjbGUgY3g9IjEyIiBjeT0iMTkuNSIgcj0iMi41IiAvPgo8L3N2Zz4K",
        "bell": "data:image/svg+xml;base64,PCEtLSBAbGljZW5zZSBsdWNpZGUtc3RhdGljIHYwLjQ2MC4wIC0gSVNDIC0tPgo8c3ZnCiAgY2xhc3M9Imx1Y2lkZSBsdWNpZGUtYmVsbCIKICB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciCiAgd2lkdGg9IjI0IgogIGhlaWdodD0iMjQiCiAgdmlld0JveD0iMCAwIDI0IDI0IgogIGZpbGw9Im5vbmUiCiAgc3Ryb2tlPSJjdXJyZW50Q29sb3IiCiAgc3Ryb2tlLXdpZHRoPSIyIgogIHN0cm9rZS1saW5lY2FwPSJyb3VuZCIKICBzdHJva2UtbGluZWpvaW49InJvdW5kIgo+CiAgPHBhdGggZD0iTTYgOGE2IDYgMCAwIDEgMTIgMGMwIDcgMyA5IDMgOUgzczMtMiAzLTkiIC8+CiAgPHBhdGggZD0iTTEwLjMgMjFhMS45NCAxLjk0IDAgMCAwIDMuNCAwIiAvPgo8L3N2Zz4K",
        "file-text": "data:image/svg+xml;base64,PCEtLSBAbGljZW5zZSBsdWNpZGUtc3RhdGljIHYwLjQ2MC4wIC0gSVNDIC0tPgo8c3ZnCiAgY2xhc3M9Imx1Y2lkZSBsdWNpZGUtZmlsZS10ZXh0IgogIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyIKICB3aWR0aD0iMjQiCiAgaGVpZ2h0PSIyNCIKICB2aWV3Qm94PSIwIDAgMjQgMjQiCiAgZmlsbD0ibm9uZSIKICBzdHJva2U9ImN1cnJlbnRDb2xvciIKICBzdHJva2Utd2lkdGg9IjIiCiAgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIgogIHN0cm9rZS1saW5lam9pbj0icm91bmQiCj4KICA8cGF0aCBkPSJNMTUgMkg2YTIgMiAwIDAgMC0yIDJ2MTZhMiAyIDAgMCAwIDIgMmgxMmEyIDIgMCAwIDAgMi0yVjdaIiAvPgogIDxwYXRoIGQ9Ik0xNCAydjRhMiAyIDAgMCAwIDIgMmg0IiAvPgogIDxwYXRoIGQ9Ik0xMCA5SDgiIC8+CiAgPHBhdGggZD0iTTE2IDEzSDgiIC8+CiAgPHBhdGggZD0iTTE2IDE3SDgiIC8+Cjwvc3ZnPgo=",
        "search": "data:image/svg+xml;base64,PCEtLSBAbGljZW5zZSBsdWNpZGUtc3RhdGljIHYwLjQ2MC4wIC0gSVNDIC0tPgo8c3ZnCiAgY2xhc3M9Imx1Y2lkZSBsdWNpZGUtc2VhcmNoIgogIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyIKICB3aWR0aD0iMjQiCiAgaGVpZ2h0PSIyNCIKICB2aWV3Qm94PSIwIDAgMjQgMjQiCiAgZmlsbD0ibm9uZSIKICBzdHJva2U9ImN1cnJlbnRDb2xvciIKICBzdHJva2Utd2lkdGg9IjIiCiAgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIgogIHN0cm9rZS1saW5lam9pbj0icm91bmQiCj4KICA8Y2lyY2xlIGN4PSIxMSIgY3k9IjExIiByPSI4IiAvPgogIDxwYXRoIGQ9Im0yMSAyMS00LjMtNC4zIiAvPgo8L3N2Zz4K",
        "chevron-down": "data:image/svg+xml;base64,PCEtLSBAbGljZW5zZSBsdWNpZGUtc3RhdGljIHYwLjQ2MC4wIC0gSVNDIC0tPgo8c3ZnCiAgY2xhc3M9Imx1Y2lkZSBsdWNpZGUtY2hldnJvbi1kb3duIgogIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyIKICB3aWR0aD0iMjQiCiAgaGVpZ2h0PSIyNCIKICB2aWV3Qm94PSIwIDAgMjQgMjQiCiAgZmlsbD0ibm9uZSIKICBzdHJva2U9ImN1cnJlbnRDb2xvciIKICBzdHJva2Utd2lkdGg9IjIiCiAgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIgogIHN0cm9rZS1saW5lam9pbj0icm91bmQiCj4KICA8cGF0aCBkPSJtNiA5IDYgNiA2LTYiIC8+Cjwvc3ZnPgo=",
        "chevron-right": "data:image/svg+xml;base64,PCEtLSBAbGljZW5zZSBsdWNpZGUtc3RhdGljIHYwLjQ2MC4wIC0gSVNDIC0tPgo8c3ZnCiAgY2xhc3M9Imx1Y2lkZSBsdWNpZGUtY2hldnJvbi1yaWdodCIKICB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciCiAgd2lkdGg9IjI0IgogIGhlaWdodD0iMjQiCiAgdmlld0JveD0iMCAwIDI0IDI0IgogIGZpbGw9Im5vbmUiCiAgc3Ryb2tlPSJjdXJyZW50Q29sb3IiCiAgc3Ryb2tlLXdpZHRoPSIyIgogIHN0cm9rZS1saW5lY2FwPSJyb3VuZCIKICBzdHJva2UtbGluZWpvaW49InJvdW5kIgo+CiAgPHBhdGggZD0ibTkgMTggNi02LTYtNiIgLz4KPC9zdmc+Cg==",
        "trending-down": "data:image/svg+xml;base64,PCEtLSBAbGljZW5zZSBsdWNpZGUtc3RhdGljIHYwLjQ2MC4wIC0gSVNDIC0tPgo8c3ZnCiAgY2xhc3M9Imx1Y2lkZSBsdWNpZGUtdHJlbmRpbmctZG93biIKICB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciCiAgd2lkdGg9IjI0IgogIGhlaWdodD0iMjQiCiAgdmlld0JveD0iMCAwIDI0IDI0IgogIGZpbGw9Im5vbmUiCiAgc3Ryb2tlPSJjdXJyZW50Q29sb3IiCiAgc3Ryb2tlLXdpZHRoPSIyIgogIHN0cm9rZS1saW5lY2FwPSJyb3VuZCIKICBzdHJva2UtbGluZWpvaW49InJvdW5kIgo+CiAgPHBvbHlsaW5lIHBvaW50cz0iMjIgMTcgMTMuNSA4LjUgOC41IDEzLjUgMiA3IiAvPgogIDxwb2x5bGluZSBwb2ludHM9IjE2IDE3IDIyIDE3IDIyIDExIiAvPgo8L3N2Zz4K",
        "trending-up": "data:image/svg+xml;base64,PCEtLSBAbGljZW5zZSBsdWNpZGUtc3RhdGljIHYwLjQ2MC4wIC0gSVNDIC0tPgo8c3ZnCiAgY2xhc3M9Imx1Y2lkZSBsdWNpZGUtdHJlbmRpbmctdXAiCiAgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIgogIHdpZHRoPSIyNCIKICBoZWlnaHQ9IjI0IgogIHZpZXdCb3g9IjAgMCAyNCAyNCIKICBmaWxsPSJub25lIgogIHN0cm9rZT0iY3VycmVudENvbG9yIgogIHN0cm9rZS13aWR0aD0iMiIKICBzdHJva2UtbGluZWNhcD0icm91bmQiCiAgc3Ryb2tlLWxpbmVqb2luPSJyb3VuZCIKPgogIDxwb2x5bGluZSBwb2ludHM9IjIyIDcgMTMuNSAxNS41IDguNSAxMC41IDIgMTciIC8+CiAgPHBvbHlsaW5lIHBvaW50cz0iMTYgNyAyMiA3IDIyIDEzIiAvPgo8L3N2Zz4K",
        "eye": "data:image/svg+xml;base64,PCEtLSBAbGljZW5zZSBsdWNpZGUtc3RhdGljIHYwLjQ2MC4wIC0gSVNDIC0tPgo8c3ZnCiAgY2xhc3M9Imx1Y2lkZSBsdWNpZGUtZXllIgogIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyIKICB3aWR0aD0iMjQiCiAgaGVpZ2h0PSIyNCIKICB2aWV3Qm94PSIwIDAgMjQgMjQiCiAgZmlsbD0ibm9uZSIKICBzdHJva2U9ImN1cnJlbnRDb2xvciIKICBzdHJva2Utd2lkdGg9IjIiCiAgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIgogIHN0cm9rZS1saW5lam9pbj0icm91bmQiCj4KICA8cGF0aCBkPSJNMi4wNjIgMTIuMzQ4YTEgMSAwIDAgMSAwLS42OTYgMTAuNzUgMTAuNzUgMCAwIDEgMTkuODc2IDAgMSAxIDAgMCAxIDAgLjY5NiAxMC43NSAxMC43NSAwIDAgMS0xOS44NzYgMCIgLz4KICA8Y2lyY2xlIGN4PSIxMiIgY3k9IjEyIiByPSIzIiAvPgo8L3N2Zz4K",
        "arrow-up-right": "data:image/svg+xml;base64,PCEtLSBAbGljZW5zZSBsdWNpZGUtc3RhdGljIHYwLjQ2MC4wIC0gSVNDIC0tPgo8c3ZnCiAgY2xhc3M9Imx1Y2lkZSBsdWNpZGUtYXJyb3ctdXAtcmlnaHQiCiAgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIgogIHdpZHRoPSIyNCIKICBoZWlnaHQ9IjI0IgogIHZpZXdCb3g9IjAgMCAyNCAyNCIKICBmaWxsPSJub25lIgogIHN0cm9rZT0iY3VycmVudENvbG9yIgogIHN0cm9rZS13aWR0aD0iMiIKICBzdHJva2UtbGluZWNhcD0icm91bmQiCiAgc3Ryb2tlLWxpbmVqb2luPSJyb3VuZCIKPgogIDxwYXRoIGQ9Ik03IDdoMTB2MTAiIC8+CiAgPHBhdGggZD0iTTcgMTcgMTcgNyIgLz4KPC9zdmc+Cg==",
        "arrow-down-right": "data:image/svg+xml;base64,PCEtLSBAbGljZW5zZSBsdWNpZGUtc3RhdGljIHYwLjQ2MC4wIC0gSVNDIC0tPgo8c3ZnCiAgY2xhc3M9Imx1Y2lkZSBsdWNpZGUtYXJyb3ctZG93bi1yaWdodCIKICB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciCiAgd2lkdGg9IjI0IgogIGhlaWdodD0iMjQiCiAgdmlld0JveD0iMCAwIDI0IDI0IgogIGZpbGw9Im5vbmUiCiAgc3Ryb2tlPSJjdXJyZW50Q29sb3IiCiAgc3Ryb2tlLXdpZHRoPSIyIgogIHN0cm9rZS1saW5lY2FwPSJyb3VuZCIKICBzdHJva2UtbGluZWpvaW49InJvdW5kIgo+CiAgPHBhdGggZD0ibTcgNyAxMCAxMCIgLz4KICA8cGF0aCBkPSJNMTcgN3YxMEg3IiAvPgo8L3N2Zz4K",
        "minus": "data:image/svg+xml;base64,PCEtLSBAbGljZW5zZSBsdWNpZGUtc3RhdGljIHYwLjQ2MC4wIC0gSVNDIC0tPgo8c3ZnCiAgY2xhc3M9Imx1Y2lkZSBsdWNpZGUtbWludXMiCiAgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIgogIHdpZHRoPSIyNCIKICBoZWlnaHQ9IjI0IgogIHZpZXdCb3g9IjAgMCAyNCAyNCIKICBmaWxsPSJub25lIgogIHN0cm9rZT0iY3VycmVudENvbG9yIgogIHN0cm9rZS13aWR0aD0iMiIKICBzdHJva2UtbGluZWNhcD0icm91bmQiCiAgc3Ryb2tlLWxpbmVqb2luPSJyb3VuZCIKPgogIDxwYXRoIGQ9Ik01IDEyaDE0IiAvPgo8L3N2Zz4K",
        "triangle-alert": "data:image/svg+xml;base64,PCEtLSBAbGljZW5zZSBsdWNpZGUtc3RhdGljIHYwLjQ2MC4wIC0gSVNDIC0tPgo8c3ZnCiAgY2xhc3M9Imx1Y2lkZSBsdWNpZGUtdHJpYW5nbGUtYWxlcnQiCiAgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIgogIHdpZHRoPSIyNCIKICBoZWlnaHQ9IjI0IgogIHZpZXdCb3g9IjAgMCAyNCAyNCIKICBmaWxsPSJub25lIgogIHN0cm9rZT0iY3VycmVudENvbG9yIgogIHN0cm9rZS13aWR0aD0iMiIKICBzdHJva2UtbGluZWNhcD0icm91bmQiCiAgc3Ryb2tlLWxpbmVqb2luPSJyb3VuZCIKPgogIDxwYXRoIGQ9Im0yMS43MyAxOC04LTE0YTIgMiAwIDAgMC0zLjQ4IDBsLTggMTRBMiAyIDAgMCAwIDQgMjFoMTZhMiAyIDAgMCAwIDEuNzMtMyIgLz4KICA8cGF0aCBkPSJNMTIgOXY0IiAvPgogIDxwYXRoIGQ9Ik0xMiAxN2guMDEiIC8+Cjwvc3ZnPgo=",
        "circle-alert": "data:image/svg+xml;base64,PCEtLSBAbGljZW5zZSBsdWNpZGUtc3RhdGljIHYwLjQ2MC4wIC0gSVNDIC0tPgo8c3ZnCiAgY2xhc3M9Imx1Y2lkZSBsdWNpZGUtY2lyY2xlLWFsZXJ0IgogIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyIKICB3aWR0aD0iMjQiCiAgaGVpZ2h0PSIyNCIKICB2aWV3Qm94PSIwIDAgMjQgMjQiCiAgZmlsbD0ibm9uZSIKICBzdHJva2U9ImN1cnJlbnRDb2xvciIKICBzdHJva2Utd2lkdGg9IjIiCiAgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIgogIHN0cm9rZS1saW5lam9pbj0icm91bmQiCj4KICA8Y2lyY2xlIGN4PSIxMiIgY3k9IjEyIiByPSIxMCIgLz4KICA8bGluZSB4MT0iMTIiIHgyPSIxMiIgeTE9IjgiIHkyPSIxMiIgLz4KICA8bGluZSB4MT0iMTIiIHgyPSIxMi4wMSIgeTE9IjE2IiB5Mj0iMTYiIC8+Cjwvc3ZnPgo=",
        "circle-check": "data:image/svg+xml;base64,PCEtLSBAbGljZW5zZSBsdWNpZGUtc3RhdGljIHYwLjQ2MC4wIC0gSVNDIC0tPgo8c3ZnCiAgY2xhc3M9Imx1Y2lkZSBsdWNpZGUtY2lyY2xlLWNoZWNrIgogIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyIKICB3aWR0aD0iMjQiCiAgaGVpZ2h0PSIyNCIKICB2aWV3Qm94PSIwIDAgMjQgMjQiCiAgZmlsbD0ibm9uZSIKICBzdHJva2U9ImN1cnJlbnRDb2xvciIKICBzdHJva2Utd2lkdGg9IjIiCiAgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIgogIHN0cm9rZS1saW5lam9pbj0icm91bmQiCj4KICA8Y2lyY2xlIGN4PSIxMiIgY3k9IjEyIiByPSIxMCIgLz4KICA8cGF0aCBkPSJtOSAxMiAyIDIgNC00IiAvPgo8L3N2Zz4K",
        "info": "data:image/svg+xml;base64,PCEtLSBAbGljZW5zZSBsdWNpZGUtc3RhdGljIHYwLjQ2MC4wIC0gSVNDIC0tPgo8c3ZnCiAgY2xhc3M9Imx1Y2lkZSBsdWNpZGUtaW5mbyIKICB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciCiAgd2lkdGg9IjI0IgogIGhlaWdodD0iMjQiCiAgdmlld0JveD0iMCAwIDI0IDI0IgogIGZpbGw9Im5vbmUiCiAgc3Ryb2tlPSJjdXJyZW50Q29sb3IiCiAgc3Ryb2tlLXdpZHRoPSIyIgogIHN0cm9rZS1saW5lY2FwPSJyb3VuZCIKICBzdHJva2UtbGluZWpvaW49InJvdW5kIgo+CiAgPGNpcmNsZSBjeD0iMTIiIGN5PSIxMiIgcj0iMTAiIC8+CiAgPHBhdGggZD0iTTEyIDE2di00IiAvPgogIDxwYXRoIGQ9Ik0xMiA4aC4wMSIgLz4KPC9zdmc+Cg==",
        "x": "data:image/svg+xml;base64,PCEtLSBAbGljZW5zZSBsdWNpZGUtc3RhdGljIHYwLjQ2MC4wIC0gSVNDIC0tPgo8c3ZnCiAgY2xhc3M9Imx1Y2lkZSBsdWNpZGUteCIKICB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciCiAgd2lkdGg9IjI0IgogIGhlaWdodD0iMjQiCiAgdmlld0JveD0iMCAwIDI0IDI0IgogIGZpbGw9Im5vbmUiCiAgc3Ryb2tlPSJjdXJyZW50Q29sb3IiCiAgc3Ryb2tlLXdpZHRoPSIyIgogIHN0cm9rZS1saW5lY2FwPSJyb3VuZCIKICBzdHJva2UtbGluZWpvaW49InJvdW5kIgo+CiAgPHBhdGggZD0iTTE4IDYgNiAxOCIgLz4KICA8cGF0aCBkPSJtNiA2IDEyIDEyIiAvPgo8L3N2Zz4K",
        "check": "data:image/svg+xml;base64,PCEtLSBAbGljZW5zZSBsdWNpZGUtc3RhdGljIHYwLjQ2MC4wIC0gSVNDIC0tPgo8c3ZnCiAgY2xhc3M9Imx1Y2lkZSBsdWNpZGUtY2hlY2siCiAgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIgogIHdpZHRoPSIyNCIKICBoZWlnaHQ9IjI0IgogIHZpZXdCb3g9IjAgMCAyNCAyNCIKICBmaWxsPSJub25lIgogIHN0cm9rZT0iY3VycmVudENvbG9yIgogIHN0cm9rZS13aWR0aD0iMiIKICBzdHJva2UtbGluZWNhcD0icm91bmQiCiAgc3Ryb2tlLWxpbmVqb2luPSJyb3VuZCIKPgogIDxwYXRoIGQ9Ik0yMCA2IDkgMTdsLTUtNSIgLz4KPC9zdmc+Cg==",
        "download": "data:image/svg+xml;base64,PCEtLSBAbGljZW5zZSBsdWNpZGUtc3RhdGljIHYwLjQ2MC4wIC0gSVNDIC0tPgo8c3ZnCiAgY2xhc3M9Imx1Y2lkZSBsdWNpZGUtZG93bmxvYWQiCiAgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIgogIHdpZHRoPSIyNCIKICBoZWlnaHQ9IjI0IgogIHZpZXdCb3g9IjAgMCAyNCAyNCIKICBmaWxsPSJub25lIgogIHN0cm9rZT0iY3VycmVudENvbG9yIgogIHN0cm9rZS13aWR0aD0iMiIKICBzdHJva2UtbGluZWNhcD0icm91bmQiCiAgc3Ryb2tlLWxpbmVqb2luPSJyb3VuZCIKPgogIDxwYXRoIGQ9Ik0yMSAxNXY0YTIgMiAwIDAgMS0yIDJINWEyIDIgMCAwIDEtMi0ydi00IiAvPgogIDxwb2x5bGluZSBwb2ludHM9IjcgMTAgMTIgMTUgMTcgMTAiIC8+CiAgPGxpbmUgeDE9IjEyIiB4Mj0iMTIiIHkxPSIxNSIgeTI9IjMiIC8+Cjwvc3ZnPgo=",
        "bell-plus": "data:image/svg+xml;base64,PCEtLSBAbGljZW5zZSBsdWNpZGUtc3RhdGljIHYwLjQ2MC4wIC0gSVNDIC0tPgo8c3ZnCiAgY2xhc3M9Imx1Y2lkZSBsdWNpZGUtYmVsbC1wbHVzIgogIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyIKICB3aWR0aD0iMjQiCiAgaGVpZ2h0PSIyNCIKICB2aWV3Qm94PSIwIDAgMjQgMjQiCiAgZmlsbD0ibm9uZSIKICBzdHJva2U9ImN1cnJlbnRDb2xvciIKICBzdHJva2Utd2lkdGg9IjIiCiAgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIgogIHN0cm9rZS1saW5lam9pbj0icm91bmQiCj4KICA8cGF0aCBkPSJNMTkuMyAxNC44QzIwLjEgMTYuNCAyMSAxNyAyMSAxN0gzczMtMiAzLTljMC0zLjMgMi43LTYgNi02IDEgMCAxLjkuMiAyLjguNyIgLz4KICA8cGF0aCBkPSJNMTAuMyAyMWExLjk0IDEuOTQgMCAwIDAgMy40IDAiIC8+CiAgPHBhdGggZD0iTTE1IDhoNiIgLz4KICA8cGF0aCBkPSJNMTggNXY2IiAvPgo8L3N2Zz4K",
        "plus": "data:image/svg+xml;base64,PCEtLSBAbGljZW5zZSBsdWNpZGUtc3RhdGljIHYwLjQ2MC4wIC0gSVNDIC0tPgo8c3ZnCiAgY2xhc3M9Imx1Y2lkZSBsdWNpZGUtcGx1cyIKICB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciCiAgd2lkdGg9IjI0IgogIGhlaWdodD0iMjQiCiAgdmlld0JveD0iMCAwIDI0IDI0IgogIGZpbGw9Im5vbmUiCiAgc3Ryb2tlPSJjdXJyZW50Q29sb3IiCiAgc3Ryb2tlLXdpZHRoPSIyIgogIHN0cm9rZS1saW5lY2FwPSJyb3VuZCIKICBzdHJva2UtbGluZWpvaW49InJvdW5kIgo+CiAgPHBhdGggZD0iTTUgMTJoMTQiIC8+CiAgPHBhdGggZD0iTTEyIDV2MTQiIC8+Cjwvc3ZnPgo=",
        "pencil": "data:image/svg+xml;base64,PCEtLSBAbGljZW5zZSBsdWNpZGUtc3RhdGljIHYwLjQ2MC4wIC0gSVNDIC0tPgo8c3ZnCiAgY2xhc3M9Imx1Y2lkZSBsdWNpZGUtcGVuY2lsIgogIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyIKICB3aWR0aD0iMjQiCiAgaGVpZ2h0PSIyNCIKICB2aWV3Qm94PSIwIDAgMjQgMjQiCiAgZmlsbD0ibm9uZSIKICBzdHJva2U9ImN1cnJlbnRDb2xvciIKICBzdHJva2Utd2lkdGg9IjIiCiAgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIgogIHN0cm9rZS1saW5lam9pbj0icm91bmQiCj4KICA8cGF0aCBkPSJNMjEuMTc0IDYuODEyYTEgMSAwIDAgMC0zLjk4Ni0zLjk4N0wzLjg0MiAxNi4xNzRhMiAyIDAgMCAwLS41LjgzbC0xLjMyMSA0LjM1MmEuNS41IDAgMCAwIC42MjMuNjIybDQuMzUzLTEuMzJhMiAyIDAgMCAwIC44My0uNDk3eiIgLz4KICA8cGF0aCBkPSJtMTUgNSA0IDQiIC8+Cjwvc3ZnPgo=",
        "external-link": "data:image/svg+xml;base64,PCEtLSBAbGljZW5zZSBsdWNpZGUtc3RhdGljIHYwLjQ2MC4wIC0gSVNDIC0tPgo8c3ZnCiAgY2xhc3M9Imx1Y2lkZSBsdWNpZGUtZXh0ZXJuYWwtbGluayIKICB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciCiAgd2lkdGg9IjI0IgogIGhlaWdodD0iMjQiCiAgdmlld0JveD0iMCAwIDI0IDI0IgogIGZpbGw9Im5vbmUiCiAgc3Ryb2tlPSJjdXJyZW50Q29sb3IiCiAgc3Ryb2tlLXdpZHRoPSIyIgogIHN0cm9rZS1saW5lY2FwPSJyb3VuZCIKICBzdHJva2UtbGluZWpvaW49InJvdW5kIgo+CiAgPHBhdGggZD0iTTE1IDNoNnY2IiAvPgogIDxwYXRoIGQ9Ik0xMCAxNCAyMSAzIiAvPgogIDxwYXRoIGQ9Ik0xOCAxM3Y2YTIgMiAwIDAgMS0yIDJINWEyIDIgMCAwIDEtMi0yVjhhMiAyIDAgMCAxIDItMmg2IiAvPgo8L3N2Zz4K",
        "file-plus": "data:image/svg+xml;base64,PCEtLSBAbGljZW5zZSBsdWNpZGUtc3RhdGljIHYwLjQ2MC4wIC0gSVNDIC0tPgo8c3ZnCiAgY2xhc3M9Imx1Y2lkZSBsdWNpZGUtZmlsZS1wbHVzIgogIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyIKICB3aWR0aD0iMjQiCiAgaGVpZ2h0PSIyNCIKICB2aWV3Qm94PSIwIDAgMjQgMjQiCiAgZmlsbD0ibm9uZSIKICBzdHJva2U9ImN1cnJlbnRDb2xvciIKICBzdHJva2Utd2lkdGg9IjIiCiAgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIgogIHN0cm9rZS1saW5lam9pbj0icm91bmQiCj4KICA8cGF0aCBkPSJNMTUgMkg2YTIgMiAwIDAgMC0yIDJ2MTZhMiAyIDAgMCAwIDIgMmgxMmEyIDIgMCAwIDAgMi0yVjdaIiAvPgogIDxwYXRoIGQ9Ik0xNCAydjRhMiAyIDAgMCAwIDIgMmg0IiAvPgogIDxwYXRoIGQ9Ik05IDE1aDYiIC8+CiAgPHBhdGggZD0iTTEyIDE4di02IiAvPgo8L3N2Zz4K"
      };
      function Icon({
        name,
        size = 20,
        color = 'currentColor',
        style,
        ...rest
      }) {
        const url = 'url("' + (LW_ICONS[name] || CDN + name + '.svg') + '")';
        return /*#__PURE__*/React.createElement("span", _extends({
          "aria-hidden": "true"
        }, rest, {
          style: {
            display: 'inline-block',
            flex: 'none',
            width: size,
            height: size,
            background: color,
            WebkitMask: url + ' center/contain no-repeat',
            mask: url + ' center/contain no-repeat',
            ...style
          }
        }));
      }
      Object.assign(__ds_scope, {
        Icon
      });
    })();
  } catch (e) {
    __ds_ns.__errors.push({
      path: "components/icons/Icon.jsx",
      error: String(e && e.message || e)
    });
  }

  // components/actions/Button.jsx
  try {
    (() => {
      function _extends() {
        return _extends = Object.assign ? Object.assign.bind() : function (n) {
          for (var e = 1; e < arguments.length; e++) {
            var t = arguments[e];
            for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]);
          }
          return n;
        }, _extends.apply(null, arguments);
      }
      const V = {
        primary: {
          background: 'var(--action-primary)',
          color: 'var(--text-on-brand)',
          border: 'none'
        },
        secondary: {
          background: 'transparent',
          color: 'var(--text-primary)',
          border: '1px solid var(--border-strong)'
        },
        tertiary: {
          background: 'transparent',
          color: 'var(--text-primary)',
          border: 'none'
        },
        link: {
          background: 'transparent',
          color: 'var(--text-link)',
          border: 'none'
        },
        destructive: {
          background: 'var(--action-destructive)',
          color: 'var(--white)',
          border: 'none'
        }
      };
      function Button({
        variant = 'primary',
        size = 'md',
        pill = false,
        icon,
        iconRight,
        fullWidth = false,
        disabled = false,
        children,
        style,
        ...rest
      }) {
        const [h, setH] = React.useState(false);
        const [p, setP] = React.useState(false);
        const v = V[variant] || V.primary;
        const bordered = variant === 'secondary';
        const pad = variant === 'tertiary' || variant === 'link' ? size === 'sm' ? '6px 12px' : '8px 16px' : size === 'sm' ? bordered ? '7px 15px' : '8px 16px' : bordered ? '11px 23px' : '12px 24px';
        let bg = v.background;
        if (!disabled && (h || p)) {
          bg = variant === 'primary' ? p ? 'var(--action-primary-pressed)' : 'var(--action-primary-pressed)' : variant === 'destructive' ? '#E62E44' : p ? 'var(--overlay-pressed)' : 'var(--overlay-hover)';
        }
        const dis = disabled ? variant === 'primary' || variant === 'destructive' ? {
          background: 'var(--gray-200)',
          color: 'var(--gray-500)'
        } : {
          color: 'var(--text-disabled)',
          borderColor: 'var(--gray-200)'
        } : {};
        return /*#__PURE__*/React.createElement("button", _extends({
          disabled: disabled,
          onMouseEnter: () => setH(true),
          onMouseLeave: () => {
            setH(false);
            setP(false);
          },
          onMouseDown: () => setP(true),
          onMouseUp: () => setP(false)
        }, rest, {
          style: {
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 8,
            font: size === 'sm' ? '700 14px/1 var(--font-sans)' : 'var(--type-button)',
            padding: pad,
            borderRadius: pill ? 'var(--radius-full)' : 'var(--radius-md)',
            cursor: disabled ? 'not-allowed' : 'pointer',
            width: fullWidth ? '100%' : undefined,
            transition: 'background var(--dur-fast) var(--ease-standard), transform var(--dur-fast)',
            transform: p && !disabled ? 'scale(0.98)' : 'none',
            whiteSpace: 'nowrap',
            ...v,
            background: bg,
            ...dis,
            ...style
          }
        }), icon && /*#__PURE__*/React.createElement(__ds_scope.Icon, {
          name: icon,
          size: size === 'sm' ? 16 : 18
        }), children, iconRight && /*#__PURE__*/React.createElement(__ds_scope.Icon, {
          name: iconRight,
          size: size === 'sm' ? 16 : 18
        }));
      }
      Object.assign(__ds_scope, {
        Button
      });
    })();
  } catch (e) {
    __ds_ns.__errors.push({
      path: "components/actions/Button.jsx",
      error: String(e && e.message || e)
    });
  }

  // components/actions/IconButton.jsx
  try {
    (() => {
      function _extends() {
        return _extends = Object.assign ? Object.assign.bind() : function (n) {
          for (var e = 1; e < arguments.length; e++) {
            var t = arguments[e];
            for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]);
          }
          return n;
        }, _extends.apply(null, arguments);
      }
      function IconButton({
        icon,
        size = 'md',
        variant = 'ghost',
        label,
        badge,
        style,
        ...rest
      }) {
        const [h, setH] = React.useState(false);
        const d = size === 'sm' ? 32 : size === 'lg' ? 48 : 40;
        const base = variant === 'filled' ? {
          background: h ? 'var(--action-primary-pressed)' : 'var(--action-primary)',
          color: '#fff',
          boxShadow: 'var(--shadow-popover)'
        } : variant === 'outline' ? {
          background: h ? 'var(--overlay-hover)' : 'transparent',
          border: '1px solid var(--border-strong)',
          color: 'var(--text-primary)'
        } : {
          background: h ? 'var(--overlay-hover)' : 'transparent',
          color: 'var(--text-primary)'
        };
        return /*#__PURE__*/React.createElement("button", _extends({
          "aria-label": label,
          title: label,
          onMouseEnter: () => setH(true),
          onMouseLeave: () => setH(false)
        }, rest, {
          style: {
            position: 'relative',
            width: d,
            height: d,
            borderRadius: 'var(--radius-full)',
            border: 'none',
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
            padding: 0,
            transition: 'background var(--dur-fast)',
            ...base,
            ...style
          }
        }), /*#__PURE__*/React.createElement(__ds_scope.Icon, {
          name: icon,
          size: size === 'sm' ? 18 : size === 'lg' ? 24 : 20
        }), badge != null && /*#__PURE__*/React.createElement("span", {
          style: {
            position: 'absolute',
            top: 2,
            right: 2,
            minWidth: 16,
            height: 16,
            padding: '0 4px',
            borderRadius: 999,
            background: 'var(--red-500)',
            color: '#fff',
            font: 'var(--type-badge)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 0 0 2px #fff'
          }
        }, badge));
      }
      Object.assign(__ds_scope, {
        IconButton
      });
    })();
  } catch (e) {
    __ds_ns.__errors.push({
      path: "components/actions/IconButton.jsx",
      error: String(e && e.message || e)
    });
  }

  // components/display/Tag.jsx
  try {
    (() => {
      const T = {
        positive: ['var(--sentiment-positive-bg)', '#05A648'],
        negative: ['var(--sentiment-negative-bg)', '#E0203A'],
        mixed: ['var(--sentiment-mixed-bg)', '#C77700'],
        neutral: ['var(--gray-100)', 'var(--gray-700)'],
        info: ['var(--blue-tint)', '#0066D6'],
        outline: ['transparent', 'var(--gray-700)']
      };
      function Tag({
        tone = 'neutral',
        dot = false,
        icon,
        onRemove,
        selected = false,
        onClick,
        children,
        style
      }) {
        const [bg, fg] = selected ? ['var(--gray-900)', '#fff'] : T[tone] || T.neutral;
        return /*#__PURE__*/React.createElement("span", {
          onClick: onClick,
          style: {
            display: 'inline-flex',
            alignItems: 'center',
            gap: 6,
            padding: '4px 10px',
            borderRadius: 'var(--radius-sm)',
            background: bg,
            color: fg,
            font: '700 12px/1.4 var(--font-sans)',
            border: tone === 'outline' && !selected ? '1px solid var(--border-strong)' : 'none',
            cursor: onClick ? 'pointer' : 'default',
            whiteSpace: 'nowrap',
            ...style
          }
        }, dot && /*#__PURE__*/React.createElement("span", {
          style: {
            width: 6,
            height: 6,
            borderRadius: '50%',
            background: 'currentColor'
          }
        }), icon && /*#__PURE__*/React.createElement(__ds_scope.Icon, {
          name: icon,
          size: 14
        }), children, onRemove && /*#__PURE__*/React.createElement("span", {
          onClick: e => {
            e.stopPropagation();
            onRemove();
          },
          style: {
            display: 'flex',
            cursor: 'pointer',
            marginRight: -4
          }
        }, /*#__PURE__*/React.createElement(__ds_scope.Icon, {
          name: "x",
          size: 14
        })));
      }
      Object.assign(__ds_scope, {
        Tag
      });
    })();
  } catch (e) {
    __ds_ns.__errors.push({
      path: "components/display/Tag.jsx",
      error: String(e && e.message || e)
    });
  }

  // components/feedback/Banner.jsx
  try {
    (() => {
      const B = {
        warning: ['var(--orange-tint)', '#8A5300', 'triangle-alert', 'var(--orange-500)'],
        error: ['var(--red-tint)', '#B0142A', 'circle-alert', 'var(--red-500)'],
        info: ['var(--blue-tint)', '#004FA8', 'info', 'var(--blue-500)'],
        success: ['var(--line-green-tint)', '#036B2E', 'circle-check', 'var(--line-green)']
      };
      function Banner({
        tone = 'info',
        title,
        action,
        onClose,
        children,
        style
      }) {
        const [bg, fg, ic, icc] = B[tone] || B.info;
        return /*#__PURE__*/React.createElement("div", {
          style: {
            display: 'flex',
            alignItems: 'flex-start',
            gap: 12,
            padding: '12px 16px',
            borderRadius: 'var(--radius-md)',
            background: bg,
            color: fg,
            font: 'var(--type-subtext)',
            ...style
          }
        }, /*#__PURE__*/React.createElement(__ds_scope.Icon, {
          name: ic,
          size: 20,
          color: icc,
          style: {
            marginTop: 1
          }
        }), /*#__PURE__*/React.createElement("div", {
          style: {
            flex: 1
          }
        }, title && /*#__PURE__*/React.createElement("div", {
          style: {
            fontWeight: 700
          }
        }, title), children), action, onClose && /*#__PURE__*/React.createElement("span", {
          onClick: onClose,
          style: {
            cursor: 'pointer',
            display: 'flex'
          }
        }, /*#__PURE__*/React.createElement(__ds_scope.Icon, {
          name: "x",
          size: 18
        })));
      }
      Object.assign(__ds_scope, {
        Banner
      });
    })();
  } catch (e) {
    __ds_ns.__errors.push({
      path: "components/feedback/Banner.jsx",
      error: String(e && e.message || e)
    });
  }

  // components/feedback/Dialog.jsx
  try {
    (() => {
      function Dialog({
        open = true,
        title,
        description,
        onClose,
        actions,
        sheet = false,
        width = 440,
        inline = false,
        children
      }) {
        if (!open) return null;
        const panel = /*#__PURE__*/React.createElement("div", {
          role: "dialog",
          style: {
            background: 'var(--surface-elevated)',
            borderRadius: sheet ? '24px 24px 0 0' : 'var(--radius-xl)',
            boxShadow: sheet ? 'var(--shadow-sheet)' : 'var(--shadow-modal)',
            width: sheet ? '100%' : width,
            maxWidth: '100%',
            padding: 24,
            display: 'flex',
            flexDirection: 'column',
            gap: 16,
            position: 'relative'
          },
          onClick: e => e.stopPropagation()
        }, sheet && /*#__PURE__*/React.createElement("div", {
          style: {
            width: 36,
            height: 4,
            borderRadius: 2,
            background: 'var(--gray-300)',
            alignSelf: 'center',
            marginTop: -12
          }
        }), (title || onClose) && /*#__PURE__*/React.createElement("div", {
          style: {
            display: 'flex',
            alignItems: 'flex-start',
            gap: 12
          }
        }, /*#__PURE__*/React.createElement("div", {
          style: {
            flex: 1,
            font: 'var(--type-title2)'
          }
        }, title), onClose && /*#__PURE__*/React.createElement(__ds_scope.IconButton, {
          icon: "x",
          label: "Close",
          size: "sm",
          onClick: onClose,
          style: {
            margin: '-4px -8px 0 0'
          }
        })), description && /*#__PURE__*/React.createElement("div", {
          style: {
            font: 'var(--type-body)',
            color: 'var(--text-secondary)',
            textWrap: 'pretty'
          }
        }, description), children, actions && /*#__PURE__*/React.createElement("div", {
          style: {
            display: 'flex',
            gap: 8,
            justifyContent: 'flex-end',
            marginTop: 8
          }
        }, actions));
        return /*#__PURE__*/React.createElement("div", {
          onClick: onClose,
          style: {
            position: inline ? 'absolute' : 'fixed',
            inset: 0,
            background: 'var(--overlay-dim)',
            display: 'flex',
            alignItems: sheet ? 'flex-end' : 'center',
            justifyContent: 'center',
            padding: sheet ? 0 : 24,
            zIndex: 100
          }
        }, panel);
      }
      Object.assign(__ds_scope, {
        Dialog
      });
    })();
  } catch (e) {
    __ds_ns.__errors.push({
      path: "components/feedback/Dialog.jsx",
      error: String(e && e.message || e)
    });
  }

  // components/feedback/Toast.jsx
  try {
    (() => {
      const I = {
        success: ['circle-check', 'var(--line-green)'],
        error: ['circle-alert', 'var(--red-500)'],
        info: ['info', '#4DA3FF'],
        none: [null]
      };
      function Toast({
        tone = 'none',
        action,
        onAction,
        children,
        style
      }) {
        const [ic, col] = I[tone] || I.none;
        return /*#__PURE__*/React.createElement("div", {
          role: "status",
          style: {
            display: 'inline-flex',
            alignItems: 'center',
            gap: 12,
            padding: '12px 16px',
            borderRadius: 'var(--radius-lg)',
            background: 'rgba(17,17,17,0.92)',
            color: '#fff',
            font: 'var(--type-subtext)',
            boxShadow: 'var(--shadow-popover)',
            maxWidth: 480,
            ...style
          }
        }, ic && /*#__PURE__*/React.createElement(__ds_scope.Icon, {
          name: ic,
          size: 20,
          color: col
        }), /*#__PURE__*/React.createElement("span", {
          style: {
            flex: 1
          }
        }, children), action && /*#__PURE__*/React.createElement("button", {
          onClick: onAction,
          style: {
            border: 'none',
            background: 'none',
            color: 'var(--line-green)',
            font: '700 14px/1 var(--font-sans)',
            cursor: 'pointer',
            padding: 0
          }
        }, action));
      }
      Object.assign(__ds_scope, {
        Toast
      });
    })();
  } catch (e) {
    __ds_ns.__errors.push({
      path: "components/feedback/Toast.jsx",
      error: String(e && e.message || e)
    });
  }

  // components/forms/Checkbox.jsx
  try {
    (() => {
      function Checkbox({
        checked,
        defaultChecked = false,
        onChange,
        label,
        disabled = false,
        style
      }) {
        const [i, setI] = React.useState(defaultChecked);
        const on = checked ?? i;
        const t = () => {
          if (disabled) return;
          setI(!on);
          onChange && onChange(!on);
        };
        return /*#__PURE__*/React.createElement("label", {
          onClick: t,
          style: {
            display: 'inline-flex',
            alignItems: 'center',
            gap: 10,
            cursor: disabled ? 'not-allowed' : 'pointer',
            font: 'var(--type-body)',
            color: disabled ? 'var(--text-disabled)' : 'var(--text-primary)',
            ...style
          }
        }, /*#__PURE__*/React.createElement("span", {
          style: {
            width: 20,
            height: 20,
            borderRadius: 'var(--radius-sm)',
            flex: 'none',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            background: on ? disabled ? 'var(--gray-300)' : 'var(--line-green)' : 'var(--white)',
            border: on ? 'none' : '1px solid var(--border-strong)',
            transition: 'background var(--dur-fast)'
          }
        }, on && /*#__PURE__*/React.createElement(__ds_scope.Icon, {
          name: "check",
          size: 14,
          color: "#fff"
        })), label);
      }
      Object.assign(__ds_scope, {
        Checkbox
      });
    })();
  } catch (e) {
    __ds_ns.__errors.push({
      path: "components/forms/Checkbox.jsx",
      error: String(e && e.message || e)
    });
  }

  // components/forms/Input.jsx
  try {
    (() => {
      function _extends() {
        return _extends = Object.assign ? Object.assign.bind() : function (n) {
          for (var e = 1; e < arguments.length; e++) {
            var t = arguments[e];
            for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]);
          }
          return n;
        }, _extends.apply(null, arguments);
      }
      const lbl = {
        font: '700 14px/1.5 var(--font-sans)',
        color: 'var(--text-primary)'
      };
      const help = e => ({
        font: 'var(--type-caption)',
        color: e ? 'var(--text-error)' : 'var(--text-tertiary)'
      });
      function Input({
        label,
        helper,
        error,
        icon,
        variant = 'filled',
        size = 'md',
        style,
        ...rest
      }) {
        const [f, setF] = React.useState(false);
        const bc = error ? 'var(--red-500)' : f ? 'var(--border-focus)' : 'var(--border-subtle)';
        return /*#__PURE__*/React.createElement("label", {
          style: {
            display: 'flex',
            flexDirection: 'column',
            gap: 6,
            ...style
          }
        }, label && /*#__PURE__*/React.createElement("span", {
          style: lbl
        }, label), /*#__PURE__*/React.createElement("span", {
          style: {
            display: 'flex',
            alignItems: 'center',
            gap: 8,
            background: variant === 'filled' ? 'var(--surface-input)' : 'var(--white)',
            border: '1px solid ' + bc,
            borderRadius: 'var(--radius-md)',
            padding: size === 'sm' ? '8px 12px' : '12px 16px',
            color: 'var(--text-tertiary)',
            transition: 'border-color var(--dur-fast)'
          }
        }, icon && /*#__PURE__*/React.createElement(__ds_scope.Icon, {
          name: icon,
          size: 18
        }), /*#__PURE__*/React.createElement("input", _extends({
          onFocus: () => setF(true),
          onBlur: () => setF(false)
        }, rest, {
          style: {
            flex: 1,
            minWidth: 0,
            border: 'none',
            outline: 'none',
            background: 'transparent',
            font: size === 'sm' ? 'var(--type-subtext)' : 'var(--type-body)',
            color: 'var(--text-primary)',
            padding: 0
          }
        }))), (error || helper) && /*#__PURE__*/React.createElement("span", {
          style: help(error)
        }, error || helper));
      }
      Object.assign(__ds_scope, {
        Input
      });
    })();
  } catch (e) {
    __ds_ns.__errors.push({
      path: "components/forms/Input.jsx",
      error: String(e && e.message || e)
    });
  }

  // components/forms/Select.jsx
  try {
    (() => {
      function _extends() {
        return _extends = Object.assign ? Object.assign.bind() : function (n) {
          for (var e = 1; e < arguments.length; e++) {
            var t = arguments[e];
            for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]);
          }
          return n;
        }, _extends.apply(null, arguments);
      }
      const lbl = {
        font: '700 14px/1.5 var(--font-sans)',
        color: 'var(--text-primary)'
      };
      const help = e => ({
        font: 'var(--type-caption)',
        color: e ? 'var(--text-error)' : 'var(--text-tertiary)'
      });
      function Select({
        label,
        options = [],
        helper,
        size = 'md',
        variant = 'filled',
        style,
        ...rest
      }) {
        return /*#__PURE__*/React.createElement("label", {
          style: {
            display: 'flex',
            flexDirection: 'column',
            gap: 6,
            ...style
          }
        }, label && /*#__PURE__*/React.createElement("span", {
          style: lbl
        }, label), /*#__PURE__*/React.createElement("span", {
          style: {
            position: 'relative',
            display: 'flex'
          }
        }, /*#__PURE__*/React.createElement("select", _extends({}, rest, {
          style: {
            appearance: 'none',
            WebkitAppearance: 'none',
            width: '100%',
            font: size === 'sm' ? 'var(--type-subtext)' : 'var(--type-body)',
            color: 'var(--text-primary)',
            background: variant === 'filled' ? 'var(--surface-input)' : 'var(--white)',
            border: '1px solid var(--border-subtle)',
            borderRadius: 'var(--radius-md)',
            padding: size === 'sm' ? '8px 36px 8px 12px' : '12px 44px 12px 16px',
            cursor: 'pointer',
            outline: 'none'
          }
        }), options.map(o => typeof o === 'string' ? /*#__PURE__*/React.createElement("option", {
          key: o
        }, o) : /*#__PURE__*/React.createElement("option", {
          key: o.value,
          value: o.value
        }, o.label))), /*#__PURE__*/React.createElement(__ds_scope.Icon, {
          name: "chevron-down",
          size: 18,
          color: "var(--text-tertiary)",
          style: {
            position: 'absolute',
            right: size === 'sm' ? 10 : 14,
            top: '50%',
            transform: 'translateY(-50%)',
            pointerEvents: 'none'
          }
        })), helper && /*#__PURE__*/React.createElement("span", {
          style: help(false)
        }, helper));
      }
      Object.assign(__ds_scope, {
        Select
      });
    })();
  } catch (e) {
    __ds_ns.__errors.push({
      path: "components/forms/Select.jsx",
      error: String(e && e.message || e)
    });
  }

  // components/monitoring/MentionItem.jsx
  try {
    (() => {
      const L = {
        positive: 'Positive',
        negative: 'Negative',
        mixed: 'Mixed',
        neutral: 'Neutral'
      };
      function MentionItem({
        source,
        medium,
        time,
        headline,
        excerpt,
        sentiment = 'neutral',
        narrative,
        reach,
        selected = false,
        onClick,
        style
      }) {
        const [h, setH] = React.useState(false);
        return /*#__PURE__*/React.createElement("article", {
          onClick: onClick,
          onMouseEnter: () => setH(true),
          onMouseLeave: () => setH(false),
          style: {
            display: 'flex',
            gap: 12,
            padding: '16px 20px',
            borderBottom: '1px solid var(--divider)',
            background: selected ? 'var(--surface-selected)' : h && onClick ? 'var(--overlay-hover)' : 'var(--surface-base)',
            cursor: onClick ? 'pointer' : 'default',
            transition: 'background var(--dur-fast)',
            ...style
          }
        }, /*#__PURE__*/React.createElement(__ds_scope.Avatar, {
          name: source,
          size: 40,
          square: true
        }), /*#__PURE__*/React.createElement("div", {
          style: {
            flex: 1,
            minWidth: 0,
            display: 'flex',
            flexDirection: 'column',
            gap: 6
          }
        }, /*#__PURE__*/React.createElement("div", {
          style: {
            display: 'flex',
            alignItems: 'center',
            gap: 6,
            font: 'var(--type-caption)',
            color: 'var(--text-tertiary)'
          }
        }, /*#__PURE__*/React.createElement("b", {
          style: {
            color: 'var(--text-primary)',
            fontWeight: 700
          }
        }, source), medium && /*#__PURE__*/React.createElement("span", null, "\xB7 ", medium), time && /*#__PURE__*/React.createElement("span", null, "\xB7 ", time)), /*#__PURE__*/React.createElement("div", {
          style: {
            font: 'var(--type-body-bold)',
            color: 'var(--text-primary)',
            textWrap: 'pretty'
          }
        }, headline), excerpt && /*#__PURE__*/React.createElement("div", {
          style: {
            font: 'var(--type-subtext)',
            color: 'var(--text-secondary)',
            display: '-webkit-box',
            WebkitLineClamp: 2,
            WebkitBoxOrient: 'vertical',
            overflow: 'hidden'
          }
        }, excerpt), /*#__PURE__*/React.createElement("div", {
          style: {
            display: 'flex',
            alignItems: 'center',
            gap: 8,
            flexWrap: 'wrap',
            marginTop: 2
          }
        }, /*#__PURE__*/React.createElement(__ds_scope.Tag, {
          tone: sentiment,
          dot: true
        }, L[sentiment]), narrative && /*#__PURE__*/React.createElement(__ds_scope.Tag, {
          tone: "outline",
          icon: "waypoints"
        }, narrative), reach && /*#__PURE__*/React.createElement("span", {
          style: {
            display: 'flex',
            alignItems: 'center',
            gap: 4,
            font: 'var(--type-caption)',
            color: 'var(--text-tertiary)',
            marginLeft: 'auto'
          }
        }, /*#__PURE__*/React.createElement(__ds_scope.Icon, {
          name: "eye",
          size: 14
        }), reach))));
      }
      Object.assign(__ds_scope, {
        MentionItem
      });
    })();
  } catch (e) {
    __ds_ns.__errors.push({
      path: "components/monitoring/MentionItem.jsx",
      error: String(e && e.message || e)
    });
  }

  // components/monitoring/SentimentBar.jsx
  try {
    (() => {
      const C = {
        positive: 'var(--sentiment-positive)',
        neutral: 'var(--gray-300)',
        mixed: 'var(--sentiment-mixed)',
        negative: 'var(--sentiment-negative)'
      };
      function SentimentBar({
        positive = 0,
        neutral = 0,
        mixed = 0,
        negative = 0,
        height = 8,
        showLegend = true,
        style
      }) {
        const d = {
          positive,
          neutral,
          mixed,
          negative
        };
        const tot = Object.values(d).reduce((a, b) => a + b, 0) || 1;
        return /*#__PURE__*/React.createElement("div", {
          style: {
            display: 'flex',
            flexDirection: 'column',
            gap: 10,
            ...style
          }
        }, /*#__PURE__*/React.createElement("div", {
          style: {
            display: 'flex',
            gap: 2,
            height,
            borderRadius: 999,
            overflow: 'hidden'
          }
        }, Object.entries(d).filter(([, v]) => v > 0).map(([k, v]) => /*#__PURE__*/React.createElement("span", {
          key: k,
          style: {
            flex: v,
            background: C[k]
          }
        }))), showLegend && /*#__PURE__*/React.createElement("div", {
          style: {
            display: 'flex',
            gap: 16,
            flexWrap: 'wrap'
          }
        }, Object.entries(d).filter(([, v]) => v > 0).map(([k, v]) => /*#__PURE__*/React.createElement("span", {
          key: k,
          style: {
            display: 'flex',
            alignItems: 'center',
            gap: 6,
            font: 'var(--type-caption)',
            color: 'var(--text-secondary)'
          }
        }, /*#__PURE__*/React.createElement("span", {
          style: {
            width: 8,
            height: 8,
            borderRadius: '50%',
            background: C[k]
          }
        }), k[0].toUpperCase() + k.slice(1), " ", /*#__PURE__*/React.createElement("b", {
          style: {
            color: 'var(--text-primary)',
            fontVariantNumeric: 'tabular-nums'
          }
        }, Math.round(v / tot * 100), "%")))));
      }
      Object.assign(__ds_scope, {
        SentimentBar
      });
    })();
  } catch (e) {
    __ds_ns.__errors.push({
      path: "components/monitoring/SentimentBar.jsx",
      error: String(e && e.message || e)
    });
  }

  // components/monitoring/StatTile.jsx
  try {
    (() => {
      function StatTile({
        label,
        value,
        delta,
        deltaLabel,
        invert = false,
        icon,
        style
      }) {
        const up = delta > 0;
        const good = invert ? !up : up;
        const col = delta == null || delta === 0 ? 'var(--text-tertiary)' : good ? '#05A648' : 'var(--red-500)';
        return /*#__PURE__*/React.createElement("div", {
          style: {
            display: 'flex',
            flexDirection: 'column',
            gap: 8,
            padding: 20,
            border: '1px solid var(--border-subtle)',
            borderRadius: 'var(--radius-xl)',
            background: 'var(--surface-card)',
            minWidth: 0,
            ...style
          }
        }, /*#__PURE__*/React.createElement("div", {
          style: {
            display: 'flex',
            alignItems: 'center',
            gap: 6,
            font: 'var(--type-subtext)',
            color: 'var(--text-secondary)'
          }
        }, icon && /*#__PURE__*/React.createElement(__ds_scope.Icon, {
          name: icon,
          size: 16
        }), label), /*#__PURE__*/React.createElement("div", {
          style: {
            font: '800 32px/1.2 var(--font-sans)',
            fontVariantNumeric: 'tabular-nums',
            letterSpacing: '-0.5px'
          }
        }, value), delta != null && /*#__PURE__*/React.createElement("div", {
          style: {
            display: 'flex',
            alignItems: 'center',
            gap: 4,
            font: '700 12px/1.4 var(--font-sans)',
            color: col
          }
        }, /*#__PURE__*/React.createElement(__ds_scope.Icon, {
          name: up ? 'arrow-up-right' : delta < 0 ? 'arrow-down-right' : 'minus',
          size: 14
        }), Math.abs(delta), "%", /*#__PURE__*/React.createElement("span", {
          style: {
            fontWeight: 400,
            color: 'var(--text-tertiary)',
            marginLeft: 4
          }
        }, deltaLabel)));
      }
      Object.assign(__ds_scope, {
        StatTile
      });
    })();
  } catch (e) {
    __ds_ns.__errors.push({
      path: "components/monitoring/StatTile.jsx",
      error: String(e && e.message || e)
    });
  }

  // components/navigation/Tabs.jsx
  try {
    (() => {
      function Tabs({
        items = [],
        value,
        defaultValue,
        onChange,
        variant = 'underline',
        style
      }) {
        const [i, setI] = React.useState(defaultValue ?? (items[0] && (items[0].value ?? items[0])));
        const cur = value ?? i;
        const pick = v => {
          setI(v);
          onChange && onChange(v);
        };
        if (variant === 'segmented') return /*#__PURE__*/React.createElement("div", {
          style: {
            display: 'inline-flex',
            padding: 4,
            gap: 4,
            borderRadius: 'var(--radius-md)',
            background: 'var(--surface-subtle)',
            ...style
          }
        }, items.map(it => {
          const v = it.value ?? it,
            l = it.label ?? it,
            on = v === cur;
          return /*#__PURE__*/React.createElement("button", {
            key: v,
            onClick: () => pick(v),
            style: {
              border: 'none',
              cursor: 'pointer',
              padding: '6px 14px',
              borderRadius: 6,
              font: '700 14px/1.4 var(--font-sans)',
              background: on ? 'var(--white)' : 'transparent',
              color: on ? 'var(--text-primary)' : 'var(--text-tertiary)',
              boxShadow: on ? '0 1px 3px rgba(0,0,0,0.08)' : 'none',
              transition: 'all var(--dur-fast)'
            }
          }, l);
        }));
        return /*#__PURE__*/React.createElement("div", {
          role: "tablist",
          style: {
            display: 'flex',
            gap: 24,
            borderBottom: '1px solid var(--divider)',
            ...style
          }
        }, items.map(it => {
          const v = it.value ?? it,
            l = it.label ?? it,
            on = v === cur;
          return /*#__PURE__*/React.createElement("button", {
            key: v,
            role: "tab",
            onClick: () => pick(v),
            style: {
              border: 'none',
              background: 'none',
              cursor: 'pointer',
              padding: '12px 0',
              marginBottom: -1,
              font: '700 16px/1.4 var(--font-sans)',
              color: on ? 'var(--text-primary)' : 'var(--text-tertiary)',
              borderBottom: '2px solid ' + (on ? 'var(--gray-900)' : 'transparent'),
              display: 'flex',
              alignItems: 'center',
              gap: 6,
              transition: 'color var(--dur-fast)'
            }
          }, l, it.count != null && /*#__PURE__*/React.createElement("span", {
            style: {
              font: '400 14px/1 var(--font-sans)',
              color: 'var(--text-tertiary)'
            }
          }, it.count));
        }));
      }
      Object.assign(__ds_scope, {
        Tabs
      });
    })();
  } catch (e) {
    __ds_ns.__errors.push({
      path: "components/navigation/Tabs.jsx",
      error: String(e && e.message || e)
    });
  }

  // ui_kits/line-watch/AlertsScreen.jsx
  try {
    (() => {
      const {
        Card,
        Switch,
        Button,
        Dialog,
        Input,
        Select,
        Checkbox,
        Toast,
        IconButton,
        Tooltip
      } = window.LINEWatchDesignSystem_35397f;
      function AlertsScreen({
        toast
      }) {
        const [alerts, setAlerts] = React.useState(window.LW_DATA.alerts);
        const [open, setOpen] = React.useState(false);
        const [name, setName] = React.useState('');
        const save = () => {
          setAlerts([...alerts, {
            id: Date.now(),
            name: name || 'New alert',
            query: '"harbour plan" AND council',
            channel: 'Email',
            on: true,
            last: 'Not triggered yet'
          }]);
          setOpen(false);
          setName('');
          toast('Alert created');
        };
        return /*#__PURE__*/React.createElement("div", {
          style: {
            padding: 32,
            display: 'flex',
            flexDirection: 'column',
            gap: 16,
            maxWidth: 960
          }
        }, /*#__PURE__*/React.createElement("div", {
          style: {
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center'
          }
        }, /*#__PURE__*/React.createElement("div", {
          style: {
            font: 'var(--type-subtext)',
            color: 'var(--text-tertiary)'
          }
        }, alerts.filter(a => a.on).length, " active \xB7 ", alerts.length, " total"), /*#__PURE__*/React.createElement(Button, {
          icon: "plus",
          onClick: () => setOpen(true)
        }, "New alert")), /*#__PURE__*/React.createElement(Card, {
          padding: 0,
          style: {
            gap: 0,
            overflow: 'hidden'
          }
        }, alerts.map((a, i) => /*#__PURE__*/React.createElement("div", {
          key: a.id,
          style: {
            display: 'flex',
            alignItems: 'center',
            gap: 16,
            padding: '16px 20px',
            borderBottom: i < alerts.length - 1 ? '1px solid var(--divider)' : 'none'
          }
        }, /*#__PURE__*/React.createElement("div", {
          style: {
            flex: 1,
            minWidth: 0,
            display: 'flex',
            flexDirection: 'column',
            gap: 4
          }
        }, /*#__PURE__*/React.createElement("div", {
          style: {
            font: 'var(--type-body-bold)',
            color: a.on ? 'var(--text-primary)' : 'var(--text-tertiary)'
          }
        }, a.name), /*#__PURE__*/React.createElement("code", {
          style: {
            font: '400 13px/1.5 ui-monospace,SFMono-Regular,Menlo,monospace',
            color: 'var(--text-secondary)',
            background: 'var(--surface-subtle)',
            padding: '2px 8px',
            borderRadius: 4,
            alignSelf: 'flex-start'
          }
        }, a.query), /*#__PURE__*/React.createElement("div", {
          style: {
            font: 'var(--type-caption)',
            color: 'var(--text-tertiary)'
          }
        }, a.channel, " \xB7 ", a.last)), /*#__PURE__*/React.createElement(Tooltip, {
          content: "Edit alert"
        }, /*#__PURE__*/React.createElement(IconButton, {
          icon: "pencil",
          label: "Edit",
          size: "sm"
        })), /*#__PURE__*/React.createElement(Switch, {
          checked: a.on,
          onChange: v => setAlerts(alerts.map(x => x.id === a.id ? {
            ...x,
            on: v
          } : x))
        })))), /*#__PURE__*/React.createElement(Dialog, {
          open: open,
          title: "New alert",
          onClose: () => setOpen(false),
          width: 480,
          actions: /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement(Button, {
            variant: "secondary",
            onClick: () => setOpen(false)
          }, "Cancel"), /*#__PURE__*/React.createElement(Button, {
            onClick: save
          }, "Create alert"))
        }, /*#__PURE__*/React.createElement(Input, {
          label: "Name",
          placeholder: "e.g. Council vote coverage",
          value: name,
          onChange: e => setName(e.target.value)
        }), /*#__PURE__*/React.createElement(Input, {
          label: "Keywords",
          defaultValue: "\"harbour plan\" AND council",
          helper: "Use AND, OR, NOT and quotes for exact phrases."
        }), /*#__PURE__*/React.createElement(Select, {
          label: "Notify when",
          options: ['Any new mention', 'Negative mentions only', 'Volume spikes 2× or more']
        }), /*#__PURE__*/React.createElement("div", {
          style: {
            display: 'flex',
            gap: 24
          }
        }, /*#__PURE__*/React.createElement(Checkbox, {
          label: "Email",
          defaultChecked: true
        }), /*#__PURE__*/React.createElement(Checkbox, {
          label: "LINE message"
        }))));
      }
      window.AlertsScreen = AlertsScreen;
    })();
  } catch (e) {
    __ds_ns.__errors.push({
      path: "ui_kits/line-watch/AlertsScreen.jsx",
      error: String(e && e.message || e)
    });
  }

  // ui_kits/line-watch/FeedScreen.jsx
  try {
    (() => {
      function _extends() {
        return _extends = Object.assign ? Object.assign.bind() : function (n) {
          for (var e = 1; e < arguments.length; e++) {
            var t = arguments[e];
            for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]);
          }
          return n;
        }, _extends.apply(null, arguments);
      }
      const {
        Tabs,
        Tag,
        MentionItem,
        Checkbox,
        Button
      } = window.LINEWatchDesignSystem_35397f;
      function FeedScreen({
        onOpen,
        selected
      }) {
        const D = window.LW_DATA;
        const [tab, setTab] = React.useState('all');
        const [sent, setSent] = React.useState(null);
        const [kw, setKw] = React.useState(['"port expansion"', 'harbour plan']);
        const map = {
          online: 'Online news',
          print: 'Print',
          bc: 'Broadcast',
          social: 'X'
        };
        const list = D.mentions.filter(m => (tab === 'all' || m.medium === map[tab]) && (!sent || m.sentiment === sent));
        return /*#__PURE__*/React.createElement("div", {
          style: {
            display: 'flex',
            minHeight: '100%'
          }
        }, /*#__PURE__*/React.createElement("div", {
          style: {
            flex: 1,
            minWidth: 0,
            display: 'flex',
            flexDirection: 'column'
          }
        }, /*#__PURE__*/React.createElement("div", {
          style: {
            padding: '8px 32px 0',
            background: 'var(--white)'
          }
        }, /*#__PURE__*/React.createElement(Tabs, {
          value: tab,
          onChange: setTab,
          items: [{
            value: 'all',
            label: 'All',
            count: 1092
          }, {
            value: 'online',
            label: 'Online',
            count: 642
          }, {
            value: 'print',
            label: 'Print',
            count: 118
          }, {
            value: 'bc',
            label: 'Broadcast',
            count: 96
          }, {
            value: 'social',
            label: 'Social',
            count: 236
          }]
        })), /*#__PURE__*/React.createElement("div", {
          style: {
            display: 'flex',
            gap: 8,
            padding: '16px 32px',
            flexWrap: 'wrap',
            alignItems: 'center'
          }
        }, kw.map(k => /*#__PURE__*/React.createElement(Tag, {
          key: k,
          onRemove: () => setKw(kw.filter(x => x !== k))
        }, k)), /*#__PURE__*/React.createElement("span", {
          style: {
            width: 1,
            height: 20,
            background: 'var(--divider)',
            margin: '0 4px'
          }
        }), ['positive', 'neutral', 'mixed', 'negative'].map(s => /*#__PURE__*/React.createElement(Tag, {
          key: s,
          tone: sent === s ? 'neutral' : 'outline',
          selected: sent === s,
          dot: true,
          onClick: () => setSent(sent === s ? null : s)
        }, s[0].toUpperCase() + s.slice(1)))), /*#__PURE__*/React.createElement("div", {
          style: {
            margin: '0 32px 32px',
            border: '1px solid var(--divider)',
            borderRadius: 'var(--radius-xl)',
            overflow: 'hidden',
            background: 'var(--white)'
          }
        }, list.length ? list.map((m, i) => /*#__PURE__*/React.createElement(MentionItem, _extends({
          key: m.id
        }, m, {
          selected: selected && selected.id === m.id,
          onClick: () => onOpen(m),
          style: i === list.length - 1 ? {
            borderBottom: 'none'
          } : {}
        }))) : /*#__PURE__*/React.createElement("div", {
          style: {
            padding: 48,
            textAlign: 'center',
            font: 'var(--type-body)',
            color: 'var(--text-tertiary)'
          }
        }, "No mentions match these filters."))), /*#__PURE__*/React.createElement("aside", {
          style: {
            width: 260,
            flex: 'none',
            padding: '24px 24px',
            borderLeft: '1px solid var(--divider)',
            display: 'flex',
            flexDirection: 'column',
            gap: 20,
            background: 'var(--white)'
          }
        }, /*#__PURE__*/React.createElement("div", {
          style: {
            font: 'var(--type-headline)'
          }
        }, "Filters"), /*#__PURE__*/React.createElement("div", {
          style: {
            display: 'flex',
            flexDirection: 'column',
            gap: 12
          }
        }, /*#__PURE__*/React.createElement("div", {
          style: {
            font: '700 14px/1.4 var(--font-sans)',
            color: 'var(--text-secondary)'
          }
        }, "Language"), /*#__PURE__*/React.createElement(Checkbox, {
          label: "Japanese",
          defaultChecked: true
        }), /*#__PURE__*/React.createElement(Checkbox, {
          label: "English",
          defaultChecked: true
        }), /*#__PURE__*/React.createElement(Checkbox, {
          label: "Korean"
        })), /*#__PURE__*/React.createElement("div", {
          style: {
            display: 'flex',
            flexDirection: 'column',
            gap: 12
          }
        }, /*#__PURE__*/React.createElement("div", {
          style: {
            font: '700 14px/1.4 var(--font-sans)',
            color: 'var(--text-secondary)'
          }
        }, "Reach"), /*#__PURE__*/React.createElement(Checkbox, {
          label: "Over 1M"
        }), /*#__PURE__*/React.createElement(Checkbox, {
          label: "100K \u2013 1M",
          defaultChecked: true
        }), /*#__PURE__*/React.createElement(Checkbox, {
          label: "Under 100K",
          defaultChecked: true
        })), /*#__PURE__*/React.createElement(Button, {
          variant: "secondary",
          fullWidth: true,
          icon: "download"
        }, "Export CSV")));
      }
      window.FeedScreen = FeedScreen;
    })();
  } catch (e) {
    __ds_ns.__errors.push({
      path: "ui_kits/line-watch/FeedScreen.jsx",
      error: String(e && e.message || e)
    });
  }

  // ui_kits/line-watch/MentionDrawer.jsx
  try {
    (() => {
      const {
        IconButton,
        Tag,
        Avatar,
        Button,
        SentimentBar
      } = window.LINEWatchDesignSystem_35397f;
      function MentionDrawer({
        m,
        onClose
      }) {
        if (!m) return null;
        return /*#__PURE__*/React.createElement("div", {
          onClick: onClose,
          style: {
            position: 'fixed',
            inset: 0,
            background: 'var(--overlay-dim)',
            zIndex: 50,
            display: 'flex',
            justifyContent: 'flex-end'
          }
        }, /*#__PURE__*/React.createElement("div", {
          onClick: e => e.stopPropagation(),
          style: {
            width: 480,
            height: '100%',
            background: 'var(--white)',
            boxShadow: 'var(--shadow-modal)',
            display: 'flex',
            flexDirection: 'column'
          }
        }, /*#__PURE__*/React.createElement("div", {
          style: {
            display: 'flex',
            alignItems: 'center',
            gap: 12,
            padding: '16px 20px',
            borderBottom: '1px solid var(--divider)'
          }
        }, /*#__PURE__*/React.createElement(Avatar, {
          name: m.source,
          size: 40,
          square: true
        }), /*#__PURE__*/React.createElement("div", {
          style: {
            flex: 1
          }
        }, /*#__PURE__*/React.createElement("div", {
          style: {
            font: 'var(--type-body-bold)'
          }
        }, m.source), /*#__PURE__*/React.createElement("div", {
          style: {
            font: 'var(--type-caption)',
            color: 'var(--text-tertiary)'
          }
        }, m.medium, " \xB7 ", m.time, " \xB7 ", m.reach, " reach")), /*#__PURE__*/React.createElement(IconButton, {
          icon: "x",
          label: "Close",
          onClick: onClose
        })), /*#__PURE__*/React.createElement("div", {
          style: {
            padding: 24,
            display: 'flex',
            flexDirection: 'column',
            gap: 20,
            overflow: 'auto',
            flex: 1
          }
        }, /*#__PURE__*/React.createElement("div", {
          style: {
            font: 'var(--type-title2)',
            textWrap: 'pretty'
          }
        }, m.headline), /*#__PURE__*/React.createElement("div", {
          style: {
            display: 'flex',
            gap: 8
          }
        }, /*#__PURE__*/React.createElement(Tag, {
          tone: m.sentiment,
          dot: true
        }, m.sentiment[0].toUpperCase() + m.sentiment.slice(1)), /*#__PURE__*/React.createElement(Tag, {
          tone: "outline",
          icon: "waypoints"
        }, m.narrative)), /*#__PURE__*/React.createElement("div", {
          style: {
            font: 'var(--type-body)',
            color: 'var(--text-secondary)'
          }
        }, m.excerpt), /*#__PURE__*/React.createElement("div", {
          style: {
            padding: 16,
            borderRadius: 'var(--radius-lg)',
            background: 'var(--surface-subtle)',
            display: 'flex',
            flexDirection: 'column',
            gap: 10
          }
        }, /*#__PURE__*/React.createElement("div", {
          style: {
            font: '700 14px/1.4 var(--font-sans)'
          }
        }, "Sentence-level tone"), /*#__PURE__*/React.createElement(SentimentBar, {
          positive: 2,
          neutral: 9,
          mixed: 1,
          negative: 5
        }))), /*#__PURE__*/React.createElement("div", {
          style: {
            display: 'flex',
            gap: 8,
            padding: '16px 20px',
            borderTop: '1px solid var(--divider)'
          }
        }, /*#__PURE__*/React.createElement(Button, {
          variant: "secondary",
          icon: "external-link",
          style: {
            flex: 1
          }
        }, "Open source"), /*#__PURE__*/React.createElement(Button, {
          icon: "file-plus",
          style: {
            flex: 1
          }
        }, "Add to report"))));
      }
      window.MentionDrawer = MentionDrawer;
    })();
  } catch (e) {
    __ds_ns.__errors.push({
      path: "ui_kits/line-watch/MentionDrawer.jsx",
      error: String(e && e.message || e)
    });
  }

  // ui_kits/line-watch/NarrativesScreen.jsx
  try {
    (() => {
      function _extends() {
        return _extends = Object.assign ? Object.assign.bind() : function (n) {
          for (var e = 1; e < arguments.length; e++) {
            var t = arguments[e];
            for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]);
          }
          return n;
        }, _extends.apply(null, arguments);
      }
      const {
        Card,
        SentimentBar,
        Tag,
        Button,
        Avatar,
        Icon,
        Tabs
      } = window.LINEWatchDesignSystem_35397f;
      function NarrativesScreen({
        onNav
      }) {
        const D = window.LW_DATA;
        const [sel, setSel] = React.useState('env');
        const n = D.narratives.find(x => x.id === sel);
        return /*#__PURE__*/React.createElement("div", {
          style: {
            padding: 32,
            display: 'grid',
            gridTemplateColumns: '360px minmax(0,1fr)',
            gap: 24,
            alignItems: 'start'
          }
        }, /*#__PURE__*/React.createElement("div", {
          style: {
            display: 'flex',
            flexDirection: 'column',
            gap: 12
          }
        }, D.narratives.map(x => {
          const on = x.id === sel;
          return /*#__PURE__*/React.createElement("div", {
            key: x.id,
            onClick: () => setSel(x.id),
            style: {
              padding: 16,
              borderRadius: 'var(--radius-xl)',
              border: '1px solid ' + (on ? 'var(--line-green)' : 'var(--divider)'),
              background: on ? 'var(--surface-selected)' : 'var(--white)',
              cursor: 'pointer',
              display: 'flex',
              flexDirection: 'column',
              gap: 10,
              transition: 'all var(--dur-fast)'
            }
          }, /*#__PURE__*/React.createElement("div", {
            style: {
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center'
            }
          }, /*#__PURE__*/React.createElement("span", {
            style: {
              font: 'var(--type-body-bold)'
            }
          }, x.name), /*#__PURE__*/React.createElement("span", {
            style: {
              display: 'flex',
              alignItems: 'center',
              gap: 2,
              font: '700 12px/1 var(--font-sans)',
              color: x.trend > 0 ? 'var(--red-500)' : 'var(--text-tertiary)'
            }
          }, /*#__PURE__*/React.createElement(Icon, {
            name: x.trend > 0 ? 'arrow-up-right' : 'arrow-down-right',
            size: 14
          }), Math.abs(x.trend), "%")), /*#__PURE__*/React.createElement(SentimentBar, _extends({}, x.sentiment, {
            height: 6,
            showLegend: false
          })), /*#__PURE__*/React.createElement("div", {
            style: {
              font: 'var(--type-caption)',
              color: 'var(--text-tertiary)'
            }
          }, x.mentions, " mentions \xB7 ", x.share, "% share of voice"));
        })), /*#__PURE__*/React.createElement(Card, {
          padding: 28,
          style: {
            gap: 24
          }
        }, /*#__PURE__*/React.createElement("div", {
          style: {
            display: 'flex',
            alignItems: 'flex-start',
            gap: 16
          }
        }, /*#__PURE__*/React.createElement("div", {
          style: {
            flex: 1
          }
        }, /*#__PURE__*/React.createElement("div", {
          style: {
            font: 'var(--type-caption)',
            color: 'var(--text-tertiary)',
            marginBottom: 4
          }
        }, "Narrative"), /*#__PURE__*/React.createElement("div", {
          style: {
            font: 'var(--type-title1)'
          }
        }, n.name)), /*#__PURE__*/React.createElement(Button, {
          variant: "secondary",
          icon: "bell-plus"
        }, "Create alert"), /*#__PURE__*/React.createElement(Button, {
          icon: "file-text"
        }, "Add to report")), /*#__PURE__*/React.createElement("div", {
          style: {
            font: 'var(--type-body)',
            color: 'var(--text-secondary)',
            textWrap: 'pretty',
            maxWidth: 640
          }
        }, n.summary), /*#__PURE__*/React.createElement("div", {
          style: {
            display: 'grid',
            gridTemplateColumns: 'repeat(3,1fr)',
            gap: 16
          }
        }, [['Mentions', n.mentions], ['Share of voice', n.share + '%'], ['Change', (n.trend > 0 ? '+' : '') + n.trend + '%']].map(([l, v]) => /*#__PURE__*/React.createElement("div", {
          key: l,
          style: {
            padding: 16,
            borderRadius: 'var(--radius-lg)',
            background: 'var(--surface-subtle)'
          }
        }, /*#__PURE__*/React.createElement("div", {
          style: {
            font: 'var(--type-caption)',
            color: 'var(--text-tertiary)'
          }
        }, l), /*#__PURE__*/React.createElement("div", {
          style: {
            font: '800 24px/1.4 var(--font-sans)',
            fontVariantNumeric: 'tabular-nums'
          }
        }, v)))), /*#__PURE__*/React.createElement("div", {
          style: {
            display: 'flex',
            flexDirection: 'column',
            gap: 12
          }
        }, /*#__PURE__*/React.createElement("div", {
          style: {
            font: 'var(--type-headline)'
          }
        }, "Tone"), /*#__PURE__*/React.createElement(SentimentBar, _extends({}, n.sentiment, {
          height: 12
        }))), /*#__PURE__*/React.createElement("div", {
          style: {
            display: 'flex',
            flexDirection: 'column',
            gap: 12
          }
        }, /*#__PURE__*/React.createElement("div", {
          style: {
            font: 'var(--type-headline)'
          }
        }, "Leading voices"), /*#__PURE__*/React.createElement("div", {
          style: {
            display: 'flex',
            gap: 12,
            flexWrap: 'wrap'
          }
        }, n.voices.map(v => /*#__PURE__*/React.createElement("div", {
          key: v,
          style: {
            display: 'flex',
            alignItems: 'center',
            gap: 10,
            padding: '8px 14px 8px 8px',
            border: '1px solid var(--divider)',
            borderRadius: 999
          }
        }, /*#__PURE__*/React.createElement(Avatar, {
          name: v,
          size: 32
        }), /*#__PURE__*/React.createElement("span", {
          style: {
            font: '700 14px/1 var(--font-sans)'
          }
        }, v))))), /*#__PURE__*/React.createElement("div", {
          style: {
            display: 'flex',
            flexDirection: 'column',
            gap: 12
          }
        }, /*#__PURE__*/React.createElement("div", {
          style: {
            font: 'var(--type-headline)'
          }
        }, "Key phrases"), /*#__PURE__*/React.createElement("div", {
          style: {
            display: 'flex',
            gap: 8,
            flexWrap: 'wrap'
          }
        }, ['water quality', 'dredging', 'fishing cooperative', 'independent review', 'coastal habitat', '2019 draft'].map(k => /*#__PURE__*/React.createElement(Tag, {
          key: k,
          tone: "outline"
        }, k)))), /*#__PURE__*/React.createElement(Button, {
          variant: "link",
          iconRight: "chevron-right",
          style: {
            alignSelf: 'flex-start',
            padding: 0
          },
          onClick: () => onNav('feed')
        }, "View ", n.mentions, " mentions in feed")));
      }
      window.NarrativesScreen = NarrativesScreen;
    })();
  } catch (e) {
    __ds_ns.__errors.push({
      path: "ui_kits/line-watch/NarrativesScreen.jsx",
      error: String(e && e.message || e)
    });
  }

  // ui_kits/line-watch/OverviewScreen.jsx
  try {
    (() => {
      function _extends() {
        return _extends = Object.assign ? Object.assign.bind() : function (n) {
          for (var e = 1; e < arguments.length; e++) {
            var t = arguments[e];
            for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]);
          }
          return n;
        }, _extends.apply(null, arguments);
      }
      const {
        StatTile,
        Card,
        Button,
        SentimentBar,
        ListRow,
        Banner,
        Tag,
        MentionItem
      } = window.LINEWatchDesignSystem_35397f;
      function OverviewScreen({
        onNav,
        onOpen
      }) {
        const D = window.LW_DATA;
        return /*#__PURE__*/React.createElement("div", {
          style: {
            padding: 32,
            display: 'flex',
            flexDirection: 'column',
            gap: 24
          }
        }, /*#__PURE__*/React.createElement(Banner, {
          tone: "warning",
          title: "Mention spike detected",
          action: /*#__PURE__*/React.createElement(Button, {
            size: "sm",
            variant: "secondary",
            onClick: () => onNav('narratives')
          }, "See narrative")
        }, "Negative coverage of \u201CEnvironmental impact\u201D is up 3\xD7 in the last hour."), /*#__PURE__*/React.createElement("div", {
          style: {
            display: 'grid',
            gridTemplateColumns: 'repeat(4,minmax(0,1fr))',
            gap: 16
          }
        }, /*#__PURE__*/React.createElement(StatTile, {
          label: "Mentions",
          icon: "newspaper",
          value: "1,092",
          delta: 18,
          deltaLabel: "vs prior period"
        }), /*#__PURE__*/React.createElement(StatTile, {
          label: "Negative share",
          icon: "trending-down",
          value: "28%",
          delta: 9,
          invert: true,
          deltaLabel: "vs prior period"
        }), /*#__PURE__*/React.createElement(StatTile, {
          label: "Est. reach",
          icon: "eye",
          value: "18.6M",
          delta: -4,
          deltaLabel: "vs prior period"
        }), /*#__PURE__*/React.createElement(StatTile, {
          label: "Active narratives",
          icon: "waypoints",
          value: "4",
          delta: 0,
          deltaLabel: "no change"
        })), /*#__PURE__*/React.createElement("div", {
          style: {
            display: 'grid',
            gridTemplateColumns: 'minmax(0,2fr) minmax(0,1fr)',
            gap: 16
          }
        }, /*#__PURE__*/React.createElement(Card, {
          title: "Mention volume",
          subtitle: "Daily mentions, all sources"
        }, /*#__PURE__*/React.createElement(VolumeChart, {
          data: D.volume
        })), /*#__PURE__*/React.createElement(Card, {
          title: "Sentiment",
          subtitle: "1,092 mentions"
        }, /*#__PURE__*/React.createElement(SentimentBar, {
          positive: 212,
          neutral: 432,
          mixed: 138,
          negative: 310,
          height: 12
        }), /*#__PURE__*/React.createElement("div", {
          style: {
            display: 'flex',
            flexDirection: 'column',
            gap: 10,
            marginTop: 4
          }
        }, D.narratives.slice(0, 3).map(n => /*#__PURE__*/React.createElement("div", {
          key: n.id,
          onClick: () => onNav('narratives'),
          style: {
            cursor: 'pointer',
            display: 'flex',
            flexDirection: 'column',
            gap: 6
          }
        }, /*#__PURE__*/React.createElement("div", {
          style: {
            display: 'flex',
            justifyContent: 'space-between',
            font: '700 14px/1.4 var(--font-sans)'
          }
        }, /*#__PURE__*/React.createElement("span", null, n.name), /*#__PURE__*/React.createElement("span", {
          style: {
            color: 'var(--text-tertiary)',
            fontWeight: 400
          }
        }, n.share, "%")), /*#__PURE__*/React.createElement(SentimentBar, _extends({}, n.sentiment, {
          height: 6,
          showLegend: false
        }))))))), /*#__PURE__*/React.createElement("div", {
          style: {
            display: 'grid',
            gridTemplateColumns: 'minmax(0,2fr) minmax(0,1fr)',
            gap: 16
          }
        }, /*#__PURE__*/React.createElement(Card, {
          title: "Latest mentions",
          padding: 0,
          style: {
            paddingTop: 20,
            gap: 8
          },
          action: /*#__PURE__*/React.createElement(Button, {
            variant: "tertiary",
            size: "sm",
            style: {
              marginRight: 12
            },
            onClick: () => onNav('feed')
          }, "View feed")
        }, /*#__PURE__*/React.createElement("div", {
          style: {
            paddingLeft: 0
          }
        }, D.mentions.slice(0, 3).map((m, i) => /*#__PURE__*/React.createElement(MentionItem, _extends({
          key: m.id
        }, m, {
          onClick: () => onOpen(m),
          style: i === 2 ? {
            borderBottom: 'none',
            borderRadius: '0 0 16px 16px'
          } : {}
        }))))), /*#__PURE__*/React.createElement(Card, {
          title: "Top sources",
          padding: 0,
          style: {
            paddingTop: 20,
            gap: 4
          }
        }, /*#__PURE__*/React.createElement("div", {
          style: {
            paddingLeft: 0
          }
        }, D.sources.map((s, i) => /*#__PURE__*/React.createElement(ListRow, {
          key: s.name,
          avatar: {
            name: s.name,
            size: 40,
            square: true
          },
          title: s.name,
          subtitle: s.s,
          meta: s.n + ' mentions',
          divider: i < D.sources.length - 1,
          style: {
            borderRadius: i === D.sources.length - 1 ? '0 0 16px 16px' : 0
          }
        }))))));
      }
      window.OverviewScreen = OverviewScreen;
    })();
  } catch (e) {
    __ds_ns.__errors.push({
      path: "ui_kits/line-watch/OverviewScreen.jsx",
      error: String(e && e.message || e)
    });
  }

  // ui_kits/line-watch/Sidebar.jsx
  try {
    (() => {
      const {
        Icon,
        Badge
      } = window.LINEWatchDesignSystem_35397f;
      function Sidebar({
        route,
        onNav
      }) {
        const items = [['overview', 'layout-dashboard', 'Overview'], ['feed', 'newspaper', 'Media feed', 24], ['narratives', 'waypoints', 'Narratives'], ['alerts', 'bell', 'Alerts', 1], ['reports', 'file-text', 'Reports']];
        return /*#__PURE__*/React.createElement("aside", {
          style: {
            width: 240,
            flex: 'none',
            borderRight: '1px solid var(--divider)',
            display: 'flex',
            flexDirection: 'column',
            padding: '20px 12px',
            gap: 4,
            background: 'var(--white)'
          }
        }, /*#__PURE__*/React.createElement("div", {
          style: {
            font: '800 22px/1 var(--font-sans)',
            letterSpacing: '-0.3px',
            padding: '4px 12px 24px'
          }
        }, "LINE ", /*#__PURE__*/React.createElement("span", {
          style: {
            color: 'var(--line-green)'
          }
        }, "Watch")), items.map(([k, ic, l, b]) => {
          const on = route === k;
          return /*#__PURE__*/React.createElement("button", {
            key: k,
            onClick: () => onNav(k),
            style: {
              display: 'flex',
              alignItems: 'center',
              gap: 12,
              padding: '10px 12px',
              border: 'none',
              borderRadius: 'var(--radius-md)',
              background: on ? 'var(--surface-selected)' : 'transparent',
              color: on ? '#05A648' : 'var(--text-secondary)',
              font: '700 15px/1.4 var(--font-sans)',
              cursor: 'pointer',
              textAlign: 'left'
            }
          }, /*#__PURE__*/React.createElement(Icon, {
            name: ic,
            size: 20
          }), /*#__PURE__*/React.createElement("span", {
            style: {
              flex: 1,
              color: on ? 'var(--text-primary)' : undefined
            }
          }, l), b && /*#__PURE__*/React.createElement(Badge, {
            count: b,
            variant: k === 'alerts' ? 'notification' : 'neutral'
          }));
        }), /*#__PURE__*/React.createElement("div", {
          style: {
            flex: 1
          }
        }), /*#__PURE__*/React.createElement("div", {
          style: {
            padding: 12,
            borderRadius: 'var(--radius-lg)',
            background: 'var(--surface-subtle)',
            display: 'flex',
            flexDirection: 'column',
            gap: 4
          }
        }, /*#__PURE__*/React.createElement("div", {
          style: {
            font: 'var(--type-caption)',
            color: 'var(--text-tertiary)'
          }
        }, "Workspace"), /*#__PURE__*/React.createElement("div", {
          style: {
            font: '700 14px/1.4 var(--font-sans)'
          }
        }, "Harbour Project"), /*#__PURE__*/React.createElement("div", {
          style: {
            font: 'var(--type-caption)',
            color: 'var(--text-tertiary)'
          }
        }, "4 keywords \xB7 214 sources")));
      }
      window.Sidebar = Sidebar;
    })();
  } catch (e) {
    __ds_ns.__errors.push({
      path: "ui_kits/line-watch/Sidebar.jsx",
      error: String(e && e.message || e)
    });
  }

  // ui_kits/line-watch/TopBar.jsx
  try {
    (() => {
      const {
        Input,
        Select,
        IconButton,
        Avatar
      } = window.LINEWatchDesignSystem_35397f;
      function TopBar({
        title,
        subtitle,
        actions
      }) {
        return /*#__PURE__*/React.createElement("header", {
          style: {
            display: 'flex',
            alignItems: 'center',
            gap: 16,
            padding: '16px 32px',
            borderBottom: '1px solid var(--divider)',
            background: 'var(--white)',
            position: 'sticky',
            top: 0,
            zIndex: 5
          }
        }, /*#__PURE__*/React.createElement("div", {
          style: {
            flex: 1,
            minWidth: 0
          }
        }, /*#__PURE__*/React.createElement("div", {
          style: {
            font: 'var(--type-title1)'
          }
        }, title), subtitle && /*#__PURE__*/React.createElement("div", {
          style: {
            font: 'var(--type-subtext)',
            color: 'var(--text-tertiary)'
          }
        }, subtitle)), /*#__PURE__*/React.createElement(Input, {
          icon: "search",
          placeholder: "Search mentions",
          size: "sm",
          style: {
            width: 260
          }
        }), /*#__PURE__*/React.createElement(Select, {
          size: "sm",
          options: ['Last 14 days', 'Last 24 hours', 'Last 7 days', 'Last 30 days'],
          style: {
            width: 150
          }
        }), actions, /*#__PURE__*/React.createElement(IconButton, {
          icon: "bell",
          label: "Notifications",
          badge: 1
        }), /*#__PURE__*/React.createElement(Avatar, {
          name: "Mika Sato",
          size: 36
        }));
      }
      window.TopBar = TopBar;
    })();
  } catch (e) {
    __ds_ns.__errors.push({
      path: "ui_kits/line-watch/TopBar.jsx",
      error: String(e && e.message || e)
    });
  }

  // ui_kits/line-watch/VolumeChart.jsx
  try {
    (() => {
      function VolumeChart({
        data,
        height = 180
      }) {
        const w = 600,
          max = Math.max(...data) * 1.15,
          step = w / (data.length - 1);
        const pts = data.map((v, i) => [i * step, height - v / max * height]);
        const line = pts.map(p => p.join(',')).join(' ');
        const area = '0,' + height + ' ' + line + ' ' + w + ',' + height;
        const days = ['Apr 1', '', '', 'Apr 4', '', '', 'Apr 7', '', '', 'Apr 10', '', '', 'Apr 13', ''];
        return /*#__PURE__*/React.createElement("div", {
          style: {
            display: 'flex',
            flexDirection: 'column',
            gap: 8
          }
        }, /*#__PURE__*/React.createElement("svg", {
          viewBox: '0 0 ' + w + ' ' + height,
          preserveAspectRatio: "none",
          style: {
            width: '100%',
            height
          }
        }, [0.25, 0.5, 0.75].map(f => /*#__PURE__*/React.createElement("line", {
          key: f,
          x1: "0",
          x2: w,
          y1: height * f,
          y2: height * f,
          stroke: "var(--gray-200)",
          strokeWidth: "1",
          vectorEffect: "non-scaling-stroke"
        })), /*#__PURE__*/React.createElement("polygon", {
          points: area,
          fill: "var(--line-green)",
          opacity: "0.1"
        }), /*#__PURE__*/React.createElement("polyline", {
          points: line,
          fill: "none",
          stroke: "var(--line-green)",
          strokeWidth: "2.5",
          vectorEffect: "non-scaling-stroke",
          strokeLinejoin: "round"
        })), /*#__PURE__*/React.createElement("div", {
          style: {
            display: 'flex',
            justifyContent: 'space-between',
            font: 'var(--type-caption)',
            color: 'var(--text-tertiary)'
          }
        }, days.map((d, i) => /*#__PURE__*/React.createElement("span", {
          key: i
        }, d))));
      }
      window.VolumeChart = VolumeChart;
    })();
  } catch (e) {
    __ds_ns.__errors.push({
      path: "ui_kits/line-watch/VolumeChart.jsx",
      error: String(e && e.message || e)
    });
  }

  // ui_kits/line-watch/data.js
  try {
    (() => {
      window.LW_DATA = {
        mentions: [{
          id: 1,
          source: 'Kyodo News',
          medium: 'Online news',
          time: '12 min ago',
          headline: 'Port expansion draws criticism from coastal residents',
          excerpt: 'Residents at Tuesday\'s public hearing raised concerns about dredging and truck traffic, while city officials pointed to an estimated 1,200 new jobs.',
          sentiment: 'negative',
          narrative: 'Environmental impact',
          reach: '1.2M'
        }, {
          id: 2,
          source: 'Nikkei Asia',
          medium: 'Online news',
          time: '48 min ago',
          headline: 'Logistics firms back port plan as capacity squeeze worsens',
          excerpt: 'Three of the region\'s largest carriers issued a joint statement supporting the expansion, citing rising container wait times.',
          sentiment: 'positive',
          narrative: 'Economic growth',
          reach: '860K'
        }, {
          id: 3,
          source: 'NHK',
          medium: 'Broadcast',
          time: '1h ago',
          headline: 'Evening bulletin: council vote on harbour plan delayed to May',
          excerpt: 'The council postponed its vote after receiving more than 4,000 public comments in the final week of consultation.',
          sentiment: 'neutral',
          narrative: 'Process & governance',
          reach: '3.4M'
        }, {
          id: 4,
          source: '@harbourwatch',
          medium: 'X',
          time: '2h ago',
          headline: 'Thread: what the environmental assessment leaves out',
          excerpt: 'A 14-post thread comparing the assessment to the 2019 draft has been reshared 2,300 times.',
          sentiment: 'negative',
          narrative: 'Environmental impact',
          reach: '410K'
        }, {
          id: 5,
          source: 'Asahi Shimbun',
          medium: 'Print',
          time: '3h ago',
          headline: 'Editorial: the port debate needs better numbers on both sides',
          excerpt: 'Both supporters and critics are relying on projections that have not been independently reviewed.',
          sentiment: 'mixed',
          narrative: 'Process & governance',
          reach: '5.1M'
        }, {
          id: 6,
          source: 'Japan Times',
          medium: 'Online news',
          time: '5h ago',
          headline: 'Local fishing cooperative requests independent review',
          excerpt: 'The cooperative says it is not opposed to the project but wants clearer data on water quality.',
          sentiment: 'mixed',
          narrative: 'Environmental impact',
          reach: '290K'
        }],
        narratives: [{
          id: 'env',
          name: 'Environmental impact',
          summary: 'Coverage frames the expansion as a risk to water quality and coastal habitats, led by residents and the fishing cooperative.',
          mentions: 412,
          share: 38,
          trend: +42,
          sentiment: {
            positive: 12,
            neutral: 120,
            mixed: 64,
            negative: 216
          },
          voices: ['Kyodo News', '@harbourwatch', 'Japan Times']
        }, {
          id: 'eco',
          name: 'Economic growth',
          summary: 'Business press emphasises jobs, shipping capacity and regional competitiveness against neighbouring ports.',
          mentions: 318,
          share: 29,
          trend: +8,
          sentiment: {
            positive: 188,
            neutral: 104,
            mixed: 14,
            negative: 12
          },
          voices: ['Nikkei Asia', 'Bloomberg', 'Logistics Today']
        }, {
          id: 'gov',
          name: 'Process & governance',
          summary: 'Neutral-to-critical reporting on consultation timelines, the delayed council vote and data transparency.',
          mentions: 244,
          share: 22,
          trend: -5,
          sentiment: {
            positive: 10,
            neutral: 160,
            mixed: 48,
            negative: 26
          },
          voices: ['NHK', 'Asahi Shimbun', 'Mainichi']
        }, {
          id: 'traffic',
          name: 'Traffic & noise',
          summary: 'Smaller, locally focused stories about truck routes and night-time construction noise.',
          mentions: 118,
          share: 11,
          trend: +15,
          sentiment: {
            positive: 2,
            neutral: 48,
            mixed: 12,
            negative: 56
          },
          voices: ['Kanagawa Shimbun', 'Town FM']
        }],
        volume: [42, 38, 51, 47, 60, 55, 72, 68, 81, 77, 95, 140, 168, 152],
        sources: [{
          name: 'Kyodo News',
          n: 42,
          s: 'mostly neutral'
        }, {
          name: 'Nikkei Asia',
          n: 31,
          s: 'mostly positive'
        }, {
          name: 'NHK',
          n: 28,
          s: 'neutral'
        }, {
          name: '@harbourwatch',
          n: 24,
          s: 'negative'
        }],
        alerts: [{
          id: 1,
          name: 'Port expansion — negative spike',
          query: '"port expansion" AND (protest OR dredging)',
          channel: 'Email · LINE',
          on: true,
          last: 'Triggered 12 min ago'
        }, {
          id: 2,
          name: 'CEO mentions',
          query: '"Tanaka Hiroshi" OR "CEO Tanaka"',
          channel: 'Email',
          on: true,
          last: 'Triggered yesterday'
        }, {
          id: 3,
          name: 'Competitor launches',
          query: '(Yokohama OR Kobe) AND "new terminal"',
          channel: 'Daily digest',
          on: false,
          last: 'Paused'
        }]
      };
    })();
  } catch (e) {
    __ds_ns.__errors.push({
      path: "ui_kits/line-watch/data.js",
      error: String(e && e.message || e)
    });
  }
  __ds_ns.Button = __ds_scope.Button;
  __ds_ns.IconButton = __ds_scope.IconButton;
  __ds_ns.Avatar = __ds_scope.Avatar;
  __ds_ns.Badge = __ds_scope.Badge;
  __ds_ns.Card = __ds_scope.Card;
  __ds_ns.ListRow = __ds_scope.ListRow;
  __ds_ns.Tag = __ds_scope.Tag;
  __ds_ns.Banner = __ds_scope.Banner;
  __ds_ns.Dialog = __ds_scope.Dialog;
  __ds_ns.Toast = __ds_scope.Toast;
  __ds_ns.Tooltip = __ds_scope.Tooltip;
  __ds_ns.Checkbox = __ds_scope.Checkbox;
  __ds_ns.Input = __ds_scope.Input;
  __ds_ns.Select = __ds_scope.Select;
  __ds_ns.Switch = __ds_scope.Switch;
  __ds_ns.Icon = __ds_scope.Icon;
  __ds_ns.MentionItem = __ds_scope.MentionItem;
  __ds_ns.SentimentBar = __ds_scope.SentimentBar;
  __ds_ns.StatTile = __ds_scope.StatTile;
  __ds_ns.Tabs = __ds_scope.Tabs;
})();
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/line-watch/standalone-bundle.js", error: String((e && e.message) || e) }); }

__ds_ns.Button = __ds_scope.Button;

__ds_ns.IconButton = __ds_scope.IconButton;

__ds_ns.Avatar = __ds_scope.Avatar;

__ds_ns.Badge = __ds_scope.Badge;

__ds_ns.Card = __ds_scope.Card;

__ds_ns.ListRow = __ds_scope.ListRow;

__ds_ns.Tag = __ds_scope.Tag;

__ds_ns.Banner = __ds_scope.Banner;

__ds_ns.Dialog = __ds_scope.Dialog;

__ds_ns.Toast = __ds_scope.Toast;

__ds_ns.Tooltip = __ds_scope.Tooltip;

__ds_ns.Checkbox = __ds_scope.Checkbox;

__ds_ns.Input = __ds_scope.Input;

__ds_ns.Select = __ds_scope.Select;

__ds_ns.Switch = __ds_scope.Switch;

__ds_ns.Icon = __ds_scope.Icon;

__ds_ns.MentionItem = __ds_scope.MentionItem;

__ds_ns.SentimentBar = __ds_scope.SentimentBar;

__ds_ns.StatTile = __ds_scope.StatTile;

__ds_ns.Tabs = __ds_scope.Tabs;

})();
