import "./LoadingAnimation.css"

export function LoadingAnimation({color, size}) {
  return <svg width={size|| "25px"} height={size || "25px"} viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect width="100" height="100"/>
    <circle cx="80" cy="50" r="10" fill={color || "#D5D5D5"} style={{"--offset": 0}}/>
    <circle cx="50" cy="50" r="10" fill={color || "#D5D5D5"} style={{"--offset": 1}}/>
    <circle cx="20" cy="50" r="10" fill={color || "#D5D5D5"} style={{"--offset": 2}}/>
    </svg>
}
