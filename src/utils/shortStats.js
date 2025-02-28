export function getShortName(name)
{
    let text;
    switch (name)
    {
        case "hp":
            text = "HP";
            break;
        case "attack":
            text = "ATK";
            break;
        case "defense":
            text = "DEF";
            break;
        case "special-attack":
            text = "SpA";
            break;
        case "special-defense":
            text = "SpD";
            break;
        case "speed":
            text = "SPD";
            break;
        default:
            console.log("chiu roi em oi!");
    }
    return text;
}