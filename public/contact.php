<?php
declare(strict_types=1);
header('Content-Type: application/json; charset=utf-8');
header('Cache-Control: no-store');
if ($_SERVER['REQUEST_METHOD'] !== 'POST') { http_response_code(405); echo json_encode(['error'=>'Method not allowed']); exit; }
$origin = $_SERVER['HTTP_ORIGIN'] ?? '';
if ($origin && !in_array(parse_url($origin, PHP_URL_HOST), ['vijayebhava.com','www.vijayebhava.com'], true)) { http_response_code(403); echo json_encode(['error'=>'Request not allowed']); exit; }
if (!empty($_POST['website'])) { echo json_encode(['ok'=>true]); exit; }
$name = trim((string)($_POST['name'] ?? ''));
$email = trim((string)($_POST['email'] ?? ''));
$message = trim((string)($_POST['message'] ?? ''));
if (strlen($name)<1 || strlen($name)>100 || !filter_var($email,FILTER_VALIDATE_EMAIL) || strlen($email)>254 || strlen($message)<1 || strlen($message)>2000) { http_response_code(422); echo json_encode(['error'=>'Please check your name, email and message.']); exit; }
$key = hash('sha256', $_SERVER['REMOTE_ADDR'] ?? 'unknown');
$file = sys_get_temp_dir().'/vb-contact-'.substr($key,0,24);
$fh = @fopen($file,'c+');
if ($fh) { flock($fh, LOCK_EX); $raw=stream_get_contents($fh); $times=json_decode($raw ?: '[]',true); if(!is_array($times))$times=[]; $times=array_values(array_filter($times,fn($t)=>is_int($t)&&$t>time()-3600)); if(count($times)>=5){flock($fh,LOCK_UN);fclose($fh);http_response_code(429);echo json_encode(['error'=>'Please wait a while before sending another message.']);exit;} $times[]=time(); ftruncate($fh,0); rewind($fh); fwrite($fh,json_encode($times)); fflush($fh); flock($fh,LOCK_UN); fclose($fh); }
$safeName = preg_replace('/[\r\n]+/', ' ', $name);
$subject = 'New website message from '.$safeName;
$body = "Name: {$safeName}\nEmail: {$email}\n\nMessage:\n{$message}\n";
$headers = "From: Vijayebhava Website <no-reply@vijayebhava.com>\r\nReply-To: {$email}\r\nContent-Type: text/plain; charset=UTF-8";
if (!mail('viz127@gmail.com', $subject, $body, $headers)) { http_response_code(500); echo json_encode(['error'=>'Message could not be sent right now. Please email me directly.']); exit; }
echo json_encode(['ok'=>true]);
