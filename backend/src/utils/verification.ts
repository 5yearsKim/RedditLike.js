import { transporter } from "@/utils/email";
import { env } from "@/env";


export function generateVerificationCode(): string {
  const cands = "0123456789";
  let finalString = "";
  for(let i = 0; i < 6; i++){
    const randomIdx = Math.floor(Math.random() * cands.length);
    finalString += cands[randomIdx];
  }
  return finalString;
}

export type EmailVerificationOptionT = {
  serviceName?: string
  locale?: string
}

export async function sendVerificationEmail(receiver: string, code: string, opt: EmailVerificationOptionT = {}): Promise<void>{
  const t = opt.locale == "ko" ? {
    "serviceName": opt.serviceName ?? "브이밀로(V-MILO)",
    "verificationCode": "인증 번호",
    "guide": "인증 코드를 복사해서 인증 화면에 붙여넣으세요."
  } : {
    "serviceName": opt.serviceName ?? "V-MILO",
    "verificationCode": "verification code",
    "guide": "Copy the code and paste it into the verification screen."
  };

  await transporter.sendMail({
    from: `${t.serviceName}<${env.GMAIL_MAIL}>`,
    to: receiver,
    subject: `${t.serviceName} ${t.verificationCode}`,
    html: `
    <div style="margin:0;padding:0" bgcolor="#FFFFFF">
    <table width="100%" height="100%" style="min-width:348px" border="0" cellspacing="0" cellpadding="0" lang="en">
        <tbody>
            <tr height="32" style="height:32px">
                <td></td>
            </tr>
            <tr align="center">
                <td>
                    <table border="0" cellspacing="0" cellpadding="0" style="padding-bottom:20px;max-width:516px;min-width:220px">
                        <tbody>
                            <tr>
                                <td width="8" style="width:8px"></td>
                                <td>
                                    <div style="border-style:solid;border-width:thin;border-color:#dadce0;border-radius:8px;padding:40px 20px" align="center" class="m_4020007767997721451mdv2rw">
                                        <div style="font-family:'Google Sans',Roboto,RobotoDraft,Helvetica,Arial,sans-serif;border-bottom:thin solid #dadce0;color:rgba(0,0,0,0.87);line-height:32px;padding-bottom:24px;text-align:center;word-break:break-word">
                                            <div style="font-size:24px">${t.serviceName} ${t.verificationCode}</div>
                                        </div>
                                        <div style="font-family:Roboto-Regular,Helvetica,Arial,sans-serif;font-size:14px;color:rgba(0,0,0,0.87);line-height:20px;padding-top:20px;text-align:left">${t.guide}<br>
                                            <div style="text-align:center;font-size:36px;margin-top:20px;line-height:44px">${code}</div><br></div>
                                    </div>
                                </td>
                                <td width="8" style="width:8px"></td>
                            </tr>
                        </tbody>
                    </table>
                </td>
            </tr>

        </tbody>
    </table>
</div>
    `,
  });
}