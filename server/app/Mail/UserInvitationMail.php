<?php

namespace App\Mail;

use App\Models\UserInvitation;
use Illuminate\Bus\Queueable;
use Illuminate\Mail\Mailable;
use Illuminate\Queue\SerializesModels;

class UserInvitationMail extends Mailable
{
    use Queueable, SerializesModels;

    public function __construct(
        public UserInvitation $invitation,
        public string $registrationUrl
    ) {
    }

    public function build(): self
    {
        return $this
            ->subject('You are invited to join LawConnect')
            ->view('emails.user-invitation', [
                'invitation' => $this->invitation,
                'registrationUrl' => $this->registrationUrl,
            ]);
    }
}
