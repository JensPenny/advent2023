export class Decoder {
    async decode(location: string): Promise<string> {
        const file = await Deno.open(location, { read: true });
        const decoder = new TextDecoder();
        let text = "";
        for await (const chunk of file.readable) {
            //console.log(decoder.decode(chunk));
            text += decoder.decode(chunk);
        }
        return text;
    }
}